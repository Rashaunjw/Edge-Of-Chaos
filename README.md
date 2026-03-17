# Edge of Chaos — Oral Presentation

Interactive Next.js exhibit exploring **emergence at the edge of chaos** with cellular automata demos (Game of Life, rule explorer, and more).

## Tech stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**

## Getting started (local)

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Then open `http://localhost:3000`.

### If localhost fails on this machine

If you see a crash mentioning `uv_interface_addresses` / `os.networkInterfaces()`, run Next bound to localhost explicitly:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

If you see `EMFILE: too many open files, watch`, increase your file descriptor limit before starting dev:

```bash
ulimit -n 10000
npm run dev -- --hostname 127.0.0.1 --port 3000
```

If you see `EADDRINUSE: address already in use 127.0.0.1:3000`, something else is already using port 3000. Stop it, or use a different port:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3001
```

## Scripts

```bash
# Dev
npm run dev

# Production build
npm run build

# Run production server locally (after build)
npm run start

# Lint
npm run lint
```

## Deploy (Vercel via GitHub)

1. Push this project to a GitHub repository.
2. In Vercel, click **Add New → Project** and import the repo.
3. Vercel should auto-detect **Next.js** and deploy with default settings.

Notes:
- Don’t commit `node_modules/`.
- Add any required environment variables in Vercel Project Settings → **Environment Variables** (if applicable).

