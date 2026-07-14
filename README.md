# Aperture — deploying to Vercel

This folder contains everything you need: the site (`index.html`), and three
small backend functions in `api/` that keep your Anthropic API key private
and count visits.

## What's in here
- `index.html` — the site itself
- `api/explain.js` — safely calls Anthropic's API using a key that stays on the server
- `api/track.js` — adds 1 to the visit counter every time someone loads the page
- `api/stats.js` — lets *you* check the current count (protected by a secret key)
- `package.json` — the one dependency needed for the visit counter

## Step 1 — Get an Anthropic API key
1. Go to https://console.anthropic.com and sign in (or create an account).
2. Go to **API Keys** and create a new key.
3. Copy it somewhere safe — you'll paste it into Vercel in Step 4.

Note: this is a *separate* account/key from your normal Claude.ai login —
it's for developer/API use and is billed separately (pay-as-you-go).

## Step 2 — Put this project on GitHub
1. Create a new empty repository on https://github.com/new
2. On your computer, in this folder, run:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

## Step 3 — Import into Vercel
1. Go to https://vercel.com and sign in (GitHub login is easiest).
2. Click **Add New → Project**, and select the repo you just pushed.
3. Leave the default settings as-is and click **Deploy**.
   (It will "half work" at first — the API calls will fail until Steps 4–5.)

## Step 4 — Add your API key as an environment variable
1. In your new Vercel project, go to **Settings → Environment Variables**.
2. Add:
   - Name: `ANTHROPIC_API_KEY` → Value: (the key from Step 1)
   - Name: `ADMIN_KEY` → Value: any secret word/phrase you make up (this protects your visit-count page)
3. Save.

## Step 5 — Add Vercel KV (for the visit counter)
1. In your Vercel project, go to the **Storage** tab.
2. Click **Create Database → KV** and follow the prompts.
3. When asked, **connect it to this project** — Vercel will automatically add
   the required environment variables for you.

## Step 6 — Redeploy
1. Go to the **Deployments** tab and click **Redeploy** on the latest deployment
   (this picks up the environment variables you just added).

## You're live
- Your site is now at the `.vercel.app` URL Vercel gives you (or a custom domain
  you add under **Settings → Domains**).
- Check your visit count any time at:
  `https://your-site.vercel.app/api/stats?key=YOUR_ADMIN_KEY`

## Costs
- Vercel's free tier covers this comfortably for personal/hobby traffic.
- Anthropic API usage is billed per request — for a personal experiment this
  is normally just cents unless it gets heavy traffic. You can set spend
  limits in the Anthropic console.
