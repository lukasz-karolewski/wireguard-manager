## Overview

This is a **WireGuard VPN manager** — a self-hosted web app for managing site-to-site and client VPN configurations.

- `/` - Project root with shared config, Docker, and CI
- `/src/` - Next.js application source
  - `/src/app/` - Next.js App Router pages and API routes
  - `/src/components/` - React UI components (including shadcn-style `/ui/` primitives)
  - `/src/server/` - tRPC router, Prisma DB access, server-side utilities
  - `/src/trpc/` - tRPC client setup
- `/prisma/` - Prisma schema and SQLite migrations

## Stack

- **Next.js 16** + **TypeScript** + **React 19**
- **tRPC 11** for type-safe API procedures
- **Prisma 7** with **better-sqlite3** adapter (SQLite)
- **NextAuth v5 (beta)** with Prisma adapter
- **Tailwind CSS 4.1** for styling
- **react-hook-form** + **zod** for forms and validation
- **Biome** for linting and formatting
- **Jest** + **React Testing Library** for tests

## Deployment

The app runs in Docker (single container) via `docker-compose.yaml`. The SQLite database is persisted at `prod.db`. Refer to `docker-compose.yaml` and `Dockerfile` for details.

## Instructions

- Always apply best engineering practices for each framework you're working on.
- If you are planning work and have questions, ask before proceeding.
- For auth, session, or NextAuth-adjacent changes, consult the `better-auth-best-practices` skill.
- For UI component work, consult the `shadcn` and `vercel-react-best-practices` skills.
- For new tests or fixing failing tests, use the `typescript-test-writer` agent.
