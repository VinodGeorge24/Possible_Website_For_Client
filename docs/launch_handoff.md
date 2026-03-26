# Sheena Residence Launch Handoff

## Current Scope
- V1 is an inquiry-first single-property marketing and lead-capture site.
- Guests can submit general questions and stay requests.
- The backend stores every submission and sends notification plus acknowledgment emails.
- Online payments and instant confirmed booking are intentionally deferred to phase 2.

## What This Launch Is
- A premium single-property website for Sheena Residence
- Direct inquiry capture for questions and stay requests
- Admin-visible lead storage in Django
- Email notifications and guest acknowledgments

## What This Launch Is Not
- Instant confirmed booking
- Live Stripe checkout
- Refund automation
- Availability enforcement
- Multi-property management
- Marketplace-style owner dashboards

## Recommended Deployment Shape

### Frontend Hosting
- The frontend is a standard React static build in `frontend/`.
- Suitable hosts:
  - Vercel
  - Netlify
  - Cloudflare Pages
  - Any static host that can serve the `frontend/build/` output
- Build command:
  - `npm install`
  - `npm run build`
- Publish directory:
  - `frontend/build`

### Backend Hosting
- The backend is a Django application in `backend/`.
- Suitable hosts:
  - Render
  - Railway
  - Fly.io
  - A VPS or VM where Python and a process manager can be installed
- Backend startup flow:
  - create virtual environment
  - `pip install -r requirements.txt`
  - `python manage.py migrate`
  - run the Django app behind a production server setup

### Database Note
- The current project uses SQLite for local development.
- For a serious hosted launch, the backend must have persistent storage if SQLite remains in use.
- If the target host does not provide persistent disk storage, do not launch with SQLite there.
- A later infrastructure pass can move the app to a managed database, but that is outside the current v1 scope.

## Required Environment Variables

### Backend

Use `backend/.env.example` as the template.

Required or high-priority values:
- `DJANGO_SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `FRONTEND_URL`
- `CORS_ALLOWED_ORIGINS`
- `DEFAULT_FROM_EMAIL`
- `INQUIRY_TO_EMAIL`
- `EMAIL_BACKEND`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USE_TLS`
- `EMAIL_HOST_USER`
- `EMAIL_HOST_PASSWORD`

Optional:
- `INQUIRY_BCC_EMAIL`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Frontend

Use `frontend/.env.example` as the template.

Current required value:
- `REACT_APP_API_URL`

## Development To Launch Email Switch

### Development
- Use Mailtrap SMTP values in `backend/.env`.
- Keep `INQUIRY_TO_EMAIL` pointed at the development inbox you want to inspect.
- This is the safe setup for local form testing and preview emails.

### Production Cutover
- Replace Mailtrap SMTP credentials with the real production email service or the client mailbox SMTP details.
- Set `DEFAULT_FROM_EMAIL` to the real sender identity for Sheena Residence.
- Set `INQUIRY_TO_EMAIL` to the real business inbox.
- Send one contact-form test and one stay-request test after the switch.
- Verify:
  - business notification email arrives
  - guest acknowledgment email arrives
  - inquiry records still appear in Django admin

## Command Set For Handoff

### Local Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Local Frontend
```powershell
cd frontend
npm install
npm start
```

### Verification Commands
```powershell
cd backend
python manage.py test
```

```powershell
cd frontend
npm test -- --watchAll=false --runInBand
npm run build
```

## Launch Checklist

### Product And Content
- Confirm all kosher and Shabbos inventory claims match the real property.
- Confirm all nearby Jewish-life references are accurate.
- Confirm house rules, pool-heating policy, check-in/out times, and guest limits.
- Replace placeholder phone, contact email, and any draft property claims with final client-approved values.

### Deployment
- Choose the frontend host.
- Choose the backend host.
- Confirm persistent backend storage if SQLite remains in place.
- Set all required environment variables.
- Point the frontend API URL at the deployed backend.
- Verify allowed hosts and CORS values match the real domains.

### Email
- Replace Mailtrap credentials with production email credentials.
- Set the production `DEFAULT_FROM_EMAIL`.
- Set the production `INQUIRY_TO_EMAIL`.
- Submit one live contact inquiry and one live stay request.

### Final Validation
- Run backend tests.
- Run frontend tests.
- Run a fresh frontend production build.
- Manually test the home page, contact form, and stay-request form.
- Confirm inquiries appear in Django admin.

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

## References
- Repo overview and local setup: `README.md`
- Repo map: `PROJECT_GUIDE.md`
- Current implementation snapshot: `plan/relaunch_status.md`
