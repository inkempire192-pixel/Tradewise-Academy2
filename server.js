const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const PUBLIC_DIR = path.join(__dirname, "public");

const systemPrompt = `You are TradeWise Academy's educational assistant. Explain forex, stocks, investing principles, charts, and risk management clearly for beginners. Be careful, neutral, and honest. Do not promise profits, provide guaranteed signals, or claim to know live prices. Do not present yourself as a licensed financial adviser or give personalized buy/sell recommendations. Encourage demo practice, diversification, and risk awareness. Remind users that investments can lose value when relevant. Keep answers concise and educational.`;

function send(res, status, data, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "X-Content-Type-Options": "nosniff" });
  res.end(type.startsWith("application/json") ? JSON.stringify(data) : data);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => { body += chunk; if (body.length > 20000) reject(new Error("Request too large")); });
    req.on("end", () => { try { resolve(JSON.parse(body || "{}")); } catch { reject(new Error("Invalid JSON")); } });
    req.on("error", reject);
  });
}
const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/chat") {
    if (!API_KEY) return send(res, 503, { error: "AI is not configured. Set OPENAI_API_KEY in the hosting provider's environment settings." });
    try {
      const body = await readBody(req);
      const message = String(body.message || "").trim();
      if (!message || message.length > 4000) return send(res, 400, { error: "Please send a question under 4,000 characters." });
      const upstream = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          instructions: systemPrompt,
          input: message,
          max_output_tokens: 600
        })
      });
      const data = await upstream.json();
      if (!upstream.ok) {
        console.error("AI API error:", upstream.status, data.error?.message || "Unknown error");
        return send(res, 502, { error: "The AI service could not answer right now. Check your API configuration and try again." });
      }
      let reply = data.output_text;
      if (!reply && Array.isArray(data.output)) {
        reply = data.output.flatMap(item => item.content || []).filter(item => item.type === "output_text").map(item => item.text).join("\n");
      }
      return send(res, 200, { reply: reply || "Sorry, I could not form an answer. Please try again." });
    } catch (err) {
      console.error(err.message);
      return send(res, 400, { error: "Unable to process this message. Please try again." });
    }
  }

  const requested = req.url === "/" ? "/index.html" : decodeURIComponent((req.url || "/").split("?")[0]);
  const filePath = path.normalize(path.join(PUBLIC_DIR, requested));
  if (!filePath.startsWith(PUBLIC_DIR)) return send(res, 403, { error: "Forbidden" });
  fs.readFile(filePath, (err, content) => {
    if (err) return send(res, 404, "Not found", "text/plain; charset=utf-8");
    const ext = path.extname(filePath);
    const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript" };
    send(res, 200, content, types[ext] || "application/octet-stream");
  });
});
server.listen(PORT, () => console.log(`TradeWise Academy listening on port ${PORT}`));
