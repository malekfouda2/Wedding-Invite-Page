# Hussam & Yara Wedding Invitation

A digital wedding invitation web app for Hussam & Yara's wedding on June 11, 2026. Features an animated envelope reveal, countdown timer, RSVP form, and admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/wedding run dev` — run the wedding frontend (port 22477)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, framer-motion, wouter
- API: Express 5 + express-session
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/wedding/src/` — React frontend (pages, components)
- `artifacts/api-server/src/routes/` — API route handlers (rsvp.ts, admin.ts, health.ts)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all API contracts)
- `lib/db/src/schema/rsvp.ts` — RSVP database schema
- `attached_assets/` — wedding color palette and floral frame images

## Architecture decisions

- Session-based admin authentication (no JWT) — admin credentials: username `admin`, password `admin123`
- RSVP data stored in PostgreSQL `rsvp` table via Drizzle ORM
- OpenAPI-first: all endpoints defined in openapi.yaml, hooks/schemas generated via Orval
- Floral frame image used as decorative overlay on the invitation section
- Tropical color palette (deep pink, coral, warm gold, sage green) derived from attached swatch

## Product

- **Envelope animation**: Visitors see a closed envelope with Arabic wax seal (ح & ي). Clicking opens it cinematically to reveal the invitation.
- **Invitation content**: Romantic typography with the couple's names and June 11, 2026 date, overlaid on the floral frame image.
- **Countdown timer**: Live countdown (days/hours/minutes/seconds) to the wedding date.
- **Wedding timeline**: Ceremony 6PM → Party 7PM → Buffet 9PM → Party continues.
- **Location section**: Placeholder for Google Map embed — easy to update.
- **RSVP form**: Guests select Yes/No; if Yes, name + optional plus-one captured and stored in DB.
- **Admin panel** (`/admin`): Login with admin/admin123, view all RSVPs in a table, logout.

## User preferences

- Arabic initials on envelope seal: ح (Hussam) & ي (Yara)
- Wedding date: June 11, 2026
- Admin credentials: username `admin` / password `admin123`

## Gotchas

- After changing `lib/api-spec/openapi.yaml`, always run codegen then `pnpm run typecheck:libs`
- The `@assets/` Vite alias points to `attached_assets/` — use it for the floral frame and palette images
- Session secret read from `SESSION_SECRET` env var (already provisioned)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
