# Frontend Guide (React + TypeScript)

This frontend is a lightweight React + TypeScript interface that connects to the existing Spring Boot backend. It provides a simple admin dashboard, shows key counts, previews students, and lists the available API routes.

## What was added
- A new React app inside the `frontend` folder.
- A shared API helper that reads the backend base URL from the `.env` file.
- A main dashboard page that fetches data from the backend endpoints.

## How it connects to the backend
- The backend base URL is defined in `frontend/.env` using `VITE_API_BASE_URL`.
- The API helper in `frontend/src/api.ts` builds requests based on that URL.
- The dashboard in `frontend/src/App.tsx` calls endpoints like `/departements`, `/etudiants`, `/enseignants`, and `/cours`.

### Recommended local setup (proxy)
By default the frontend uses a relative base URL (`/api`). In development, Vite proxies `/api` to the Spring Boot backend (configured in `frontend/vite.config.ts`).

This avoids most CORS problems because the browser talks to the frontend dev server, and Vite forwards requests to the backend.

## Where to edit
- UI layout and main logic: `frontend/src/App.tsx`
- API helper: `frontend/src/api.ts`
- Styling: `frontend/src/styles.css`

## Expected backend URL
By default, the frontend expects the backend at:

```
http://localhost:8081/api
```

If your backend uses a different port, update the proxy target in `frontend/vite.config.ts`.

## Data flow overview
1. `App.tsx` loads, then runs `useEffect`.
2. The API helper calls the backend endpoints.
3. The response arrays are counted and displayed as dashboard metrics.
4. A preview list of students is shown using the first five entries.

## CORS
The backend is already configured to allow all origins. No extra changes are required for local development.
