# Shivansh Sukhija — Portfolio

Personal portfolio site for Shivansh Sukhija (DevOps Engineer). A single-page static
site with a Vercel serverless function that sends contact-form messages to email.

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, and JavaScript (no build step)
- **Fonts:** Google Fonts — Playfair Display (serif) + Outfit (sans-serif)
- **Smooth scrolling:** Lenis (via CDN)
- **Email:** Nodemailer → Gmail, running as a Vercel serverless function
- **Hosting:** Vercel

## Project Structure

```
├── index.html           # Single-page portfolio (hero, projects, experience, blog, contact)
├── css/style.css        # All styling
├── js/script.js         # Menu, smooth scroll, cursor, scroll reveals, contact form
├── api/send-email.js    # Vercel serverless function — sends contact form emails
├── vercel.json          # Builds config + /api/send-email rewrite
├── package.json         # nodemailer (required by the serverless function)
└── README.md
```

## Environment Variables

The contact form relies on two environment variables. Set them in the **Vercel
dashboard** for production, and optionally in a local `.env` file at the project
root (already gitignored) when running with `vercel dev`.

| Variable      | Description                                                        |
| ------------- | ------------------------------------------------------------------ |
| `EMAIL_USER`  | The Gmail address emails are sent from and delivered to            |
| `EMAIL_PASS`  | A Gmail **App Password** for that account (see below)              |

> **Important:** Gmail no longer accepts your normal account password from
> third-party apps. You must generate an app password:
> Google Account → Security → 2-Step Verification (must be enabled) →
> App passwords → create one for "Mail". Then use that 16-character password
> as `EMAIL_PASS`.

## Local Development

```bash
# Install dependencies (nodemailer — needed if you test the function locally)
npm install

# Serve the static site
npx serve .
```

Open the printed local URL (default `http://localhost:3000`). The site is fully
static, so it works without the API — only the contact form needs a backend.

### Testing the contact form locally

The static site alone can't process form submissions — the serverless function
needs a runtime. Use the Vercel CLI to run the full stack locally (it serves the
static files and runs `api/send-email.js` with the `/api/send-email` rewrite):

```bash
npm i -g vercel
vercel dev
```

Then open the printed URL (default `http://localhost:3000`) and submit the form,
or hit the endpoint directly:

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "message": "Hello from local"}'
```

> `vercel dev` reads `EMAIL_USER`/`EMAIL_PASS` from a local `.env` file at the
> project root.

## Deploying to Vercel

1. Push the repo to GitHub and import it in the Vercel dashboard
   (or run `vercel` from the CLI).
2. In the project's **Settings → Environment Variables**, add `EMAIL_USER`
   and `EMAIL_PASS`.
3. Deploy. `vercel.json` tells Vercel to build `api/send-email.js` as a
   Node.js function and serve the rest as static files.

The contact form POSTs to `/api/send-email`, which `vercel.json` rewrites to the
serverless function.

## How the Contact Form Works

1. The form in `index.html` submits `{ name, message }` as JSON to `/api/send-email`.
2. `api/send-email.js` validates the payload, then sends an email via Gmail
   (Nodemailer) from `EMAIL_USER` to `EMAIL_USER` (it emails you).
3. `js/script.js` shows inline button feedback: "Sending…" → "Sent!" or
   "Failed — Try Again".

## License

© 2026 Shivansh Sukhija. All Rights Reserved.
