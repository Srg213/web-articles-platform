# Foxglove backend

Express + SQLite API with JWT authentication and a submit -> review -> publish workflow.

## Setup

```bash
cd backend
npm install
cp .env.example .env      # edit JWT_SECRET for anything beyond local testing
npm run seed               # creates the SQLite file and sample users/articles
npm start                  # runs on http://localhost:4000
```

## Sample accounts (created by `npm run seed`)

| Role   | Email                  | Password    |
|--------|-------------------------|-------------|
| editor | mara@foxglove.test      | editor123   |
| editor | tomas@foxglove.test     | editor123   |
| author | elena@foxglove.test     | author123   |
| author | daniel@foxglove.test    | author123   |

There's no `admin` seeded, but the `role` column supports it -- promote a user by editing
their row in `data/foxglove.db` (or add an admin-creation script) if you want one.

## API summary

- `POST /api/auth/register` `{name, email, password}` -> new author account + token
- `POST /api/auth/login` `{email, password}` -> token
- `GET  /api/auth/me` (auth) -> current user
- `GET  /api/articles/published` -> public list
- `GET  /api/articles/published/:id` -> public single article
- `POST /api/articles` (auth) `{title, category, body}` -> submit for review
- `GET  /api/articles/mine` (auth) -> your own submissions, any status
- `GET  /api/articles/queue` (editor/admin) -> submitted articles awaiting review
- `POST /api/articles/:id/claim` (editor/admin)
- `POST /api/articles/:id/publish` (editor/admin, must hold the claim)
- `POST /api/articles/:id/return` (editor/admin, must hold the claim) `{note}`

## Notes on what's simplified here

- Passwords are hashed with bcrypt; JWTs are signed with `JWT_SECRET` and expire after 7 days.
  There's no refresh-token rotation or password reset flow yet.
- SQLite is a single file (`data/foxglove.db`) -- fine for one server; swap `better-sqlite3`
  for `pg` and the same query shapes if you need Postgres later.
- No rate limiting, no email verification, no image uploads -- add these before running
  this anywhere public.
