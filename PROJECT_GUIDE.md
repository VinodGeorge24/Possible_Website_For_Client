# Scottsdale Desert Oasis Project Guide

This document is the quick reference for navigating the relaunch codebase.

## Root Layout

| File / Folder | Purpose |
| --- | --- |
| `README.md` | Main project overview, local setup, current scope, and validation commands. |
| `PROJECT_GUIDE.md` | High-level map of where product, UI, backend, and launch work live. |
| `frontend/` | React public site, content modules, page components, and inquiry form UI. |
| `backend/` | Django API, inquiry persistence, admin, email delivery, and local database. |
| `docs/` | Launch and handoff documentation. |
| `plan/` | Current implementation status and near-term execution notes. |
| `logs/` | Chronological work log for major changes and validation runs. |
| `config/` | Legacy configuration artifacts retained with the repo. |
| `tests/` | Extra test placeholders outside the Django app test suite. |

## Current Product Posture

- Single-property kosher-friendly Scottsdale rental site
- Inquiry-first launch
- No live Stripe or Zelle checkout in v1
- One business inbox for both contact questions and stay requests
- Mailtrap for development email testing

## Frontend Pointers

| Path | Purpose |
| --- | --- |
| `frontend/src/content/siteContent.js` | Canonical site copy, gallery metadata, FAQs, and section content. |
| `frontend/src/pages/` | Public route pages such as Home, About, Gallery, FAQ, Contact, and Booking. |
| `frontend/src/components/forms/` | Contact and booking-request forms wired to the backend inquiry API. |
| `frontend/src/components/layout/` | Shared navigation and footer. |
| `frontend/src/lib/inquiries.js` | Browser API client for inquiry submission. |
| `frontend/public/index.html` | App title and top-level metadata. |

## Backend Pointers

| Path | Purpose |
| --- | --- |
| `backend/inquiries/models.py` | Persistent inquiry model for contact and booking-request submissions. |
| `backend/inquiries/serializers.py` | Validation rules for contact and stay-request payloads. |
| `backend/inquiries/views.py` | Public API endpoints for inquiry submission. |
| `backend/inquiries/services.py` | Email notification and guest acknowledgment logic. |
| `backend/inquiries/admin.py` | Django admin configuration for lead review. |
| `backend/templates/emails/inquiries/` | HTML and text email templates. |
| `backend/config/settings.py` | Django settings, Mailtrap config, CORS, and business contact settings. |

## Operational Notes

- Use `plan/relaunch_status.md` as the current-state reference before making larger changes.
- Use `logs/task-log.md` for chronological notes on completed work and verification.
- Use `docs/launch_handoff.md` for launch readiness and client ownership requirements.
