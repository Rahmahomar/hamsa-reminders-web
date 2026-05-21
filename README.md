# Hamsa Reminders Web

React frontend for the Hamsa Reminders Service.

## Tech Stack

- React 19 + TypeScript
- Vite
- Axios
- Socket.IO Client
- Vitest

## Features

- Create, list, edit, and cancel project reminders
- Realtime fired notifications (Socket.IO + polling fallback)
- Sound and browser notifications
- JWT persisted in `localStorage` with logout
- Saved project IDs (datalist picker)
- Filter by status, search, and sort
- Duplicate reminder into create form
- Confirm before cancel
- Quick Fire At presets + future-date validation
- Error toasts, loading states, and error boundary
- Hamsa-branded UI with footer

## Environment

Copy `.env.example` to `.env` and adjust:

```bash
cp .env.example .env
```

| Variable | Default |
|----------|---------|
| `VITE_API_BASE_URL` | `http://localhost:3000` |
| `VITE_SOCKET_URL` | same as API |
| `VITE_CONSOLE_URL` | `https://agents.tryhamsa.com/` |
| `VITE_DEFAULT_PROJECT_ID` | demo UUID |

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
npm test
npm run preview
```

## Docker

```bash
docker build -t hamsa-reminders-web .
docker run -p 8080:80 hamsa-reminders-web
```

Build-time env vars for Vite must be passed as `ARG` if you need a custom API URL in the image.
