@AGENTS.md

# Claude Code Instructions

## Project Context
This is a full-stack developer portfolio platform. See PROJECT_BRIEF.md for the complete spec including database schema, folder structure, features, and phases.

## Tech Stack
- Next.js 16 (App Router + Turbopack)
- TypeScript (strict mode)
- Tailwind CSS v4 (CSS-native config, no JS config file)
- Prisma 7 (prisma-client generator, prisma.config.ts)
- Supabase (PostgreSQL, Auth, Storage)
- shadcn/ui for components
- Resend for emails
- pnpm as package manager

## Coding Conventions
- Use Server Components by default, Client Components only when needed
- Use Server Actions for mutations where possible
- API routes for external-facing endpoints
- Validate all inputs with Zod
- Conventional commits: feat:, fix:, chore:, docs:
- Use absolute imports with @/ alias

## Current Phase
Phase 1 — Foundation: Prisma schema, Supabase setup, auth flow, admin dashboard skeleton
