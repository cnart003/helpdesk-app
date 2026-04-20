# IT Help Desk Ticket Management System

A full-stack web application for managing IT support tickets, built with Python, Flask, SQLite, and JavaScript. Designed to simulate the core functionality of enterprise IT service management platforms like ServiceNow and Jira Service Management.

## Features

- **Ticket Submission** — Users can submit IT support tickets with title, category, priority, description, and contact information
- **Dashboard** — Real-time overview of all tickets with stats for Total, Open, In Progress, and Resolved
- **Filtering** — Filter tickets by status and priority dynamically without page reload
- **Ticket Detail View** — Full ticket information with status update capability
- **Status Management** — Update ticket status through the full lifecycle: Open → In Progress → Resolved → Closed
- **REST API** — JSON endpoint at `/api/tickets` for programmatic access to ticket data
- **Persistent Storage** — SQLite database stores all ticket data with timestamps

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3, Flask |
| Database | SQLite3 |
| Frontend | HTML5, CSS3, JavaScript |
| Templating | Jinja2 |

## Project Structure

```
helpdesk-app/
├── helpdesk.py          # Main Flask application, routes, and database logic
├── templates/
│   ├── base.html        # Base layout with navigation
│   ├── index.html       # Dashboard with stats, filters, and ticket table
│   ├── submit.html      # Ticket submission form
│   └── ticket.html      # Individual ticket detail and status update
└── static/
    └── style.css        # Custom styling
```

## Getting Started

### Prerequisites
- Python 3.x
- pip

### Installation

```bash
# Clone the repository
git clone https://github.com/cnart003/helpdesk-app.git
cd helpdesk-app

# Install dependencies
pip install flask

# Run the application
py helpdesk.py
```

Open your browser and navigate to `http://127.0.0.1:5000`

## API

### GET /api/tickets
Returns all tickets as a JSON array.

```json
[
  {
    "id": 1,
    "title": "Laptop not connecting to Wi-Fi",
    "category": "Network",
    "priority": "High",
    "status": "Open",
    "submitter_name": "John Smith",
    "submitter_email": "jsmith@company.com",
    "created_at": "2026-04-19 21:18:38",
    "updated_at": "2026-04-19 21:18:38"
  }
]
```

## Screenshots

### Dashboard
![Dashboard showing ticket stats and table](screenshots/dashboard.png)

### Submit Ticket
![Ticket submission form](screenshots/submit.png)

### Ticket Detail
![Individual ticket view with status update](screenshots/ticket.png)

## Motivation

Built to demonstrate practical understanding of IT service management workflows — the same processes used in enterprise ITSM platforms like ServiceNow, Jira Service Management, and Microsoft Power Apps. This project reflects real-world help desk operations including ticket triage, priority management, status lifecycle tracking, and documentation.

## Author

Caleb Nartey — [github.com/cnart003](https://github.com/cnart003)