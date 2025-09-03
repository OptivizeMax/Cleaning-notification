# Cleaning Updates Site

A tiny website to post your daily cleaning updates. When you publish a post, an email notification is sent to your client automatically.

## Features
- Public feed at `/` (mobile-friendly)
- Simple admin page at `/admin` with password
- Add a title, description, and optional photo
- Stores posts in a local SQLite DB
- Sends an email per new post via SMTP

---

## Quick Start (Local)
1. **Install Python 3.11+** and **pip**.
2. Clone the repo and open a terminal in this folder:
   ```bash
   python -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
