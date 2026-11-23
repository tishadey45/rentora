# Rentora — Client

Web app for **Rentora**, an equipment rental marketplace where people list equipment and renters book it by the day, week, or month.

- Live: https://rentora-six-iota.vercel.app
- API server: https://rentora-server-swart-one.vercel.app ([repo](https://github.com/tishadey45/rentora-server))

Built with Next.js (App Router) and Better Auth. Auth endpoints are served by this app at `/api/auth/*`.

## Features

- **Public catalog** — browse approved equipment with server-side search (name/location), filters (category, rental type, price range, availability), and sorting (price, newest).
- **Equipment details** — full item view with a booking dialog (start/end date, quantity).
- **Authentication** — email/password and Google sign-in (Better Auth), plus a JWT for calling the API server.
- **Role dashboards** (`customer`, `owner`, `admin`):
  - Customer — My Rentals
  - Owner — My Equipment (add, edit, delete)
  - Admin — All Users (role, status) and All Equipment (approve, reject, edit, delete)

## Tech stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui, lucide-react, react-hot-toast
- Better Auth with the MongoDB adapter (`mongodb` driver)
- `apiFetch` attaches a signed JWT to API requests

## Getting started

Requirements: Node.js 20+ and a MongoDB connection string (e.g. MongoDB Atlas).

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
# fill in the values (see below)
npm run dev
```

Open http://localhost:3000.

The Express API must be running as well — see the [server repo](https://github.com/tishadey45/rentora-server). Point `NEXT_PUBLIC_API_URL` at it.

## Environment variables

| Name | Exposed to browser | Description |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | no | Secret used to sign sessions and JWTs |
| `BETTER_AUTH_URL` | no | Base URL of this app; used for Better Auth `iss`/`aud` and the JWKS |
| `MONGODB_URI` | no | MongoDB connection string |
| `NEXT_PUBLIC_API_URL` | yes | Base URL of the Express API server |
| `GOOGLE_CLIENT_ID` | no | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | no | Google OAuth client secret |

Google sign-in also needs `<BETTER_AUTH_URL>/api/auth/callback/google` registered as an authorized redirect URI in the Google Cloud Console.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
  app/            routes: public pages, dashboard pages, /api/auth
  components/     UI and feature components
  lib/            auth, api-client (JWT), data fetchers
```

## How API calls are authenticated

`src/lib/api-client.ts` exposes `apiFetch`. It requests a signed JWT from `GET /api/auth/token` (Better Auth JWT plugin), caches it until shortly before expiry, and sends it to the API server as `Authorization: Bearer <jwt>`. Public requests (no session) are sent without a token.
