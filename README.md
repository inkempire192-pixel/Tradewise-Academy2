# TradeWise Academy — deployment package

This package contains:
- `public/index.html`: the website, customized with loveadventure5799@gmail.com
- `server.js`: a small Node.js server and secure server-side AI API proxy
- `package.json`: start script

## Run locally
1. Install Node.js 18 or newer.
2. In this folder, set `OPENAI_API_KEY` in your shell environment (never put the key in `public/index.html` or commit it).
3. Optional: set `OPENAI_MODEL` to a model available to your API account.
4. Run `npm start`.
5. Open `http://localhost:3000`.

## Deploy for free (provider limits may apply)
1. Create a GitHub repository and upload these files.
2. Create a Node web service on a hosting provider that supports Node.js, such as Render.
3. Connect the repository; build command can be left blank and start command is `npm start`.
4. Add environment variable `OPENAI_API_KEY` in the hosting dashboard. Optionally add `OPENAI_MODEL`.
5. Deploy and test the public URL on mobile and desktop.

Important: free hosting may sleep, have usage limits, or change its free tier. An AI API key and API usage billing/limits may be required separately; a ChatGPT subscription does not automatically include API usage. Keep your API key private.

## Contact form
The contact form opens the visitor's email application with an email addressed to loveadventure5799@gmail.com. It does not store messages in a database or send them automatically. For a server-backed contact form, add a trusted email/form service later.

## Safety and production notes
- The assistant is for general education, not personalized financial advice, trade signals, or profit guarantees.
- Add rate limiting, abuse protection, a privacy notice, and appropriate legal disclosures before public promotion.
- Never ask visitors to submit passwords, API keys, banking credentials, or wallet recovery phrases.
