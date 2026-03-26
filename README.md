# Scottsdale Desert Oasis

A single-property kosher-friendly Scottsdale rental website built with React and Django.

## Project Structure

```
├── frontend/          # React frontend application
├── backend/           # Django backend application
├── docs/              # Launch and handoff documentation
├── plan/              # Current implementation status
├── logs/              # Chronological task log
├── tests/             # Test placeholders
└── config/            # Legacy configuration files
```

## Current Scope

- Premium single-property marketing site
- Inquiry-first stay request flow
- General contact form
- Server-side email notifications and guest acknowledgments
- Django admin visibility for inquiries
- Responsive public pages for overview, gallery, FAQ, and contact

## Technology Stack

### Frontend
- React.js
- TailwindCSS
- React Router
- Framer Motion

### Backend
- Django
- Django REST Framework
- SQLite for local development

### Email
- Mailtrap for development inbox testing
- Client-owned business inbox for launch

## Getting Started

### Prerequisites
- Node.js
- Python

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd [project-name]
```

2. Set up the frontend:
```bash
cd frontend
npm install
npm start
```

3. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Development

### Frontend Development
The frontend runs on http://localhost:3000 during development.

### Backend Development
The Django backend runs on http://localhost:8000.

## Testing
```bash
cd backend
python manage.py test

cd frontend
npm run build
```

## Deployment
Launch and ownership notes live in `/docs/launch_handoff.md`

## Project Operations
- Current implementation snapshot: `/plan/relaunch_status.md`
- Repo navigation guide: `/PROJECT_GUIDE.md`
- Chronological work log: `/logs/task-log.md`

## Security
- Replace placeholder secrets before any public deployment.
- Use Mailtrap in development and a client-owned domain inbox at launch.
- Treat payment/Stripe work as phase 2, not part of the v1 public site.
