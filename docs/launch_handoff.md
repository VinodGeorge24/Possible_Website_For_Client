# Scottsdale Desert Oasis Launch Handoff

## Current Scope
- V1 is an inquiry-first single-property marketing and lead-capture site.
- Guests can submit general questions and stay requests.
- The backend stores every submission and sends notification plus acknowledgment emails.
- Online payments and instant confirmed booking are intentionally deferred to phase 2.

## What The Client Must Own Before Launch
- Domain name
- Business inbox, ideally a Google Workspace mailbox such as `bookings@clientdomain.com`
- Hosting account for frontend and backend
- Analytics account, if analytics will be installed
- Future Stripe account for phase 2

## Development Email
- Use Mailtrap SMTP in `backend/.env` during development.
- Temp Mail can be used only for occasional external-recipient smoke tests.
- Do not launch the site on a disposable inbox.

## Launch Review Checklist
- Confirm all kosher and Shabbos inventory claims match the real property.
- Confirm all nearby Jewish-life references are accurate.
- Confirm house rules, pool-heating policy, check-in/out times, and guest limits.
- Replace development email settings with the client's real inbox settings.
- Replace placeholder secret values and rotate any previously exposed credentials.
- Run backend tests and a fresh frontend production build.
