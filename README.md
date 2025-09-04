# Cleaning Updates Site (Next.js)

A Next.js app to post daily cleaning updates and notify clients by email.

## Features
- Public feed at `/` showing posts.
- Admin page at `/admin` with password login.
- Add title, description, optional photo and send email notifications.
- Stores posts in SQLite via Prisma.

## Quick Start (Local)
```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Visit `http://localhost:3000` for the feed and `http://localhost:3000/admin` for admin.

## Deploy to Render
1. Create a new Web Service from this repo.
2. Set build command: `npm install && npx prisma migrate deploy && npm run build`.
3. Set start command: `npm start`.
4. Add environment variables from `.env.example` in Render dashboard.

## Environment Variables
See `.env.example` for required variables like `ADMIN_PASSWORD`, SMTP or Resend settings, and `DATABASE_URL`.

## Python

The project runs on Node.js and doesn't require Python packages. The `requirements.txt`
file is intentionally left empty to satisfy hosting providers that expect it.
