# Task Log

## 2026-03-25

- Audited the original React/Django rental site and identified that the public booking/payment flow was not production-ready.
- Reframed the project as an inquiry-first single-property Scottsdale rental website for v1 launch.
- Added a new Django inquiry subsystem for contact and booking-request capture, persistence, admin visibility, and email handling.
- Replaced committed secrets with placeholder environment files and Mailtrap-oriented development configuration.
- Rewrote the frontend around a warmer desert-luxury presentation with kosher/Shabbos positioning, anchored sections, and inquiry-first calls to action.
- Verified backend health with `manage.py check`, database migration, and Django tests.
- Verified frontend production build with `npm run build`.
- Verified live browser behavior with Playwright on the contact form and booking request form.

## 2026-03-26

- Created a fresh Mailtrap sandbox named `Sheena Residence Dev Sandbox` after older sandbox/project state caused inbox mismatches during testing.
- Updated local development SMTP credentials in `backend/.env` to the new Mailtrap sandbox and verified direct SMTP login from Python.
- Found that multiple stale Django `manage.py runserver` processes were left running in the background, which caused browser requests to hit older server instances with outdated code or config.
- Standardized the local restart approach for backend debugging: kill all `manage.py runserver` Python processes, then start one clean server with `python manage.py runserver 8000 --noreload`.
- Added Mailtrap-aware retry and pacing logic in `backend/inquiries/services.py` because the Mailtrap sandbox can reject the second email in a request with `550 Too many emails per second`.
- Confirmed the correct debugging checkpoints for future email issues:
  - Check the latest `Inquiry` row in Django for `notification_sent_at`, `acknowledgment_sent_at`, and `email_error`.
  - Check `logs/django-dev.err.log` for SMTP errors from the running server.
  - Confirm only one Django dev server is serving port `8000`.
- Current dev behavior is stable enough for Mailtrap testing, but Mailtrap sandbox throttling should still be treated as a development-only constraint rather than a product issue.
