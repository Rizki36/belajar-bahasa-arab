# Agent Notes

## Project

Next.js 15 + React 18 + TypeScript (strict) learning-quiz app using the **Pages Router** (`src/pages`), not the App Router.

## Package manager

Use **Yarn v1** (`yarn`). The lockfile is `yarn.lock` v1.

## Everyday commands

| Command | What it does |
| --- | --- |
| `yarn dev` | Next.js dev server with `--turbopack` |
| `yarn check-types` | `tsc --noEmit` |
| `yarn lint` | Biome check **with `--write`** on `./src` |
| `yarn prebuild` | Biome check read-only on `./src` (runs automatically before `yarn build`) |
| `yarn build` | Production build |
| `yarn migrate:dev` | `prisma migrate dev`, loading `.env.local` via `dotenv-cli` |
| `yarn prisma:studio` | `prisma studio`, loading `.env.local` |
| `yarn prisma:generate` | Generate Prisma client |
| `yarn vercel-build` | Vercel entrypoint: `prisma generate && prisma migrate deploy && biome check ./src && next build` |
| `yarn test` | Run Vitest in watch mode |
| `yarn test:run` | Run Vitest once (CI friendly) |

## Lint / format

- Biome is the single source of truth for linting and formatting. ESLint and Prettier are not configured.
- `yarn lint` rewrites files; if you only want diagnostics, run `yarn prebuild`.
- Biome only includes `src/**/*` (`biome.json`). Root config files are not formatted by it.

## Architecture

- Entrypoints: `src/pages/_app.tsx`, `src/pages/api/trpc/[trpc].ts`, `src/pages/api/auth/[...nextauth].ts`.
- Auth: NextAuth v4 with GoogleProvider, JWT strategy, custom Prisma adapter in `[...nextauth].ts`.
- API: tRPC v11 RC, SSR enabled (`src/utils/trpc.ts`). Routers live in `src/server/routers/{admin,client,protected}.ts`.
- Base procedures: `publicProcedure`, `protectedProcedure`, `adminProcedure`, `studentProcedure` (`src/server/trpc.ts`).
- DB: Prisma + PostgreSQL. Use the singleton exported from `prisma/db.ts`. Schema is `prisma/schema.prisma`.
- Routing guards: `src/middleware.ts` enforces role-based redirects (`/admin/*` for admins, `/belajar/*` for students, public paths for guests) and redirects logged-in users away from public auth pages.
- shadcn/ui is configured as **non-RSC** (`rsc: false`). Components are in `src/common/components/ui` with alias `@/common/components`. The `cn` helper is `src/common/utils/index.ts`.
- Modules are organized under `src/modules/{admin,client}/<module>/components`.

## Environment / secrets

- `.env.local` is **gitignored and untracked**. It is never committed. Copy `.env.example` to `.env.local` and fill in your own values.
- Required env vars: `DATABASE_URL`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `NEXTAUTH_SECRET`, `CREATE_ADMIN_SECRET`.
- Prisma migrate/studio commands explicitly source `.env.local`.
- The previously tracked `.env.local` has been removed from git. Internal secrets (`NEXTAUTH_SECRET`, `CREATE_ADMIN_SECRET`) have been rotated to new random values; replace the Google OAuth credentials and database URL with your own values.

## Build / deploy quirks

- `next-pwa` generates service-worker files into `public/`; those files are gitignored.
- `next.config.mjs` removes `console.log` in production and disables ESLint during the build.
- Image optimization allows `lh3.googleusercontent.com`.

## Raw data seeds

`prisma/seeds/` contains raw `.sql` seed files. There is no `prisma seed` script in `package.json`.

## Release

`yarn release` runs `release-it`.
