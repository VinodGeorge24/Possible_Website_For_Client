# Relaunch Status

## Current State

The project has been repositioned as a single-property kosher-friendly Scottsdale rental website with an inquiry-first launch path.

## Completed

- Replaced the public positioning with a premium single-property rental narrative.
- Added a shared content source for brand copy, kosher/Shabbos messaging, FAQs, gallery data, and property highlights.
- Redesigned the public frontend around a warmer desert-luxury visual direction.
- Replaced the public payment-first booking experience with a stay-request workflow.
- Added a Django `inquiries` app with persistent storage, validation, admin visibility, and email handling.
- Added separate contact and booking-request endpoints:
  - `POST /api/inquiries/contact/`
  - `POST /api/inquiries/booking/`
- Added development-focused email configuration using Mailtrap placeholders.
- Removed committed secrets and replaced them with example env files.
- Updated launch documentation and local setup documentation.

## Validated

- `python manage.py check`
- `python manage.py test`
- `npm run build`
- Browser verification with Playwright for:
  - home page rendering
  - contact inquiry submission
  - booking request submission

## Remaining Before Client Handoff

- Replace placeholder business phone, contact email, and property-specific claims with finalized client data.
- Confirm every kosher/Shabbos feature against the actual home inventory.
- Populate Mailtrap credentials for development or production inbox settings for launch.
- Decide whether to remove or archive legacy payment-related source files that are no longer used in v1.
- Perform a final mobile polish pass with production content and real media.

## Explicitly Deferred To Phase 2

- Stripe checkout
- Payment webhooks
- Availability enforcement
- Booking confirmation and refund workflows
- Multi-property support
