# Miami Dashboard

Hosted on Vercel. The browser reads data through `/api/airtable`; the Airtable token is never sent to the browser.

Set `AIRTABLE_TOKEN` in the Vercel project's Production environment variables, then redeploy. Use a read-only token scoped to the dashboard base. Replace the previously embedded token, which exists in earlier public Git history.

The diffuser chart is a historical snapshot through October 22, 2026.
