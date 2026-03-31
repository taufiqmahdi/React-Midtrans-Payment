# Midtrans Payment Gateway — React Frontend

React + TypeScript checkout UI handling the full Midtrans Snap payment lifecycle.

## Features
- Opens Midtrans Snap popup via a short-lived token fetched from the backend
- Custom `useMidtrans` hook encapsulating success, pending, error, and close states
- Fully typed with TypeScript — includes global `window.snap` type declarations
- Environment-based config for Client Key and Snap script URL

## Tech Stack
React · TypeScript · Vite · Axios · Midtrans Snap.js

## Getting Started
```bash
cp .env.example .env
# Fill in your Midtrans sandbox Client Key and API base URL

npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_MIDTRANS_CLIENT_KEY` | Your Midtrans Client Key (sandbox or production) |
| `VITE_SNAP_URL` | Snap.js script URL — use sandbox URL for testing |
| `VITE_API_BASE_URL` | Base URL of the Go backend |

## How It Works

1. User clicks Pay — the `useMidtrans` hook calls the backend `POST /api/transaction`
2. Backend returns a short-lived `snap_token`
3. Frontend calls `window.snap.pay(snap_token, callbacks)` to open the Midtrans popup
4. Callbacks handle success, pending, and error states in the UI
5. Final payment confirmation happens server-side via signed Midtrans webhooks — not from these frontend callbacks

> The Client Key is safe to expose in the frontend. The Server Key never leaves the backend.

## Project Structure
```
src/
├── api/
│   └── payment.ts         # Axios API client
├── components/
│   └── CheckoutButton.tsx # Pay button with status UI
├── hooks/
│   └── useMidtrans.ts     # Custom hook for payment lifecycle
└── types/
    └── midtrans.d.ts      # Global window.snap type declarations
```

## Related
- [Backend — Go + Gin](https://github.com/taufiqmahdi/Go-Midtrans-Payment)