# Foxglove frontend

React (Vite) app that talks to the backend API. Dev server proxies `/api` to
`http://localhost:4000`, so run the backend first.

## Setup

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
```

## Structure

- `src/api.js` -- fetch wrapper + typed calls to every backend route, token storage
- `src/AuthContext.jsx` -- current user, login/logout, kept in localStorage
- `src/components/` -- `Nav` (role-aware tabs) and `ProtectedRoute`
- `src/pages/` -- `Read`, `ArticleDetail`, `Login`, `Register`, `Submit`,
  `MySubmissions`, `EditorDesk`
