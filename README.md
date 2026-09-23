# The Bitcoin Standard — static newsletter signup

A single-page landing site that notifies you on Telegram when someone subscribes. No database, no admin dashboard. Built for free hosting on Netlify.

## Stack

- Vite + React (static frontend)
- One Netlify Function that calls the Telegram Bot API

## Local development

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`. Without Netlify Dev, `/api/subscribe` will fail unless you also run the function (see below).

### Test the Telegram function locally

1. Copy `.env.example` to `.env` and fill in:

   - `TELEGRAM_BOT_TOKEN` — from [@BotFather](https://t.me/BotFather)
   - `TELEGRAM_CHAT_ID` — message your bot once, then get your numeric ID via [@userinfobot](https://t.me/userinfobot) or Telegram `getUpdates`

2. Install the Netlify CLI if needed: `npm i -g netlify-cli`

3. Run:

   ```bash
   netlify dev
   ```

   This serves the site and the function together (usually on port 8888).

## Deploy to Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import from Git**.
3. Build settings are already in `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions: `netlify/functions`
4. Under **Site settings → Environment variables**, add:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
5. Deploy. Subscribe submissions POST to `/api/subscribe`, which is redirected to the function.

## How signup works

1. Visitor enters an email on the landing page.
2. Browser `POST`s `{ "email": "..." }` to `/api/subscribe`.
3. The Netlify Function validates the email and sends you a Telegram message:

   `New newsletter signup: someone@example.com`

Emails are not stored anywhere — only the Telegram notification is sent.
