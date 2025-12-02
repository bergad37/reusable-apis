# Reusable APIs

Serverless-friendly email relay that powers the website contact form. The codebase can be run locally with Express for testing and deployed to Vercel for production usage.

## Environment variables

Configure the following variables locally (via `.env`) and in Vercel:

- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_SECURE` (`true` to enable TLS, defaults to `false`)
- `EMAIL_USER`
- `EMAIL_PASS`
- `PORT` (optional, local only)

## Local development

```bash
npm install
npm run dev
# POST http://localhost:5000/send-email
```

## Deploying to Vercel

1. Install the Vercel CLI and log in.
2. Run `vercel link` inside this folder if the project has not been linked yet.
3. Set the env vars in Vercel:  
   `vercel env add EMAIL_HOST`, `vercel env add EMAIL_PORT`, etc.
4. Deploy with `vercel --prod` (or `vercel` for preview).

The `vercel.json` file routes `/send-email` to the serverless function located at `api/send-email.js`, so the same frontend integration works both locally and in the cloud.

