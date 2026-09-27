# Foxglove -- journal platform (author + editor workflow)

A submission-and-moderation blogging platform: readers browse published essays,
signed-in authors submit essays for review, and editors claim, publish, or return
submissions with a note.

```
foxglove-journal/
  backend/   Express API, SQLite database, JWT auth, seed data
  frontend/  React (Vite) single-page app
```

## Quick start

```bash
# terminal 1
cd backend
npm install
cp .env.example .env
npm run seed
npm start          # http://localhost:4000

# terminal 2
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Open http://localhost:5173. Log in as an editor (mara@foxglove.test / editor123) to
see the moderation queue, or register a new account to submit as an author.

See `backend/README.md` and `frontend/README.md` for the full API and file layout,
and the "what's simplified" note in the backend README before deploying this anywhere
public -- it covers auth/db but skips things like rate limiting and email verification.
