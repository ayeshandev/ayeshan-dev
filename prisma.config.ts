import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// dotenv/config only loads .env — explicitly load .env.local for Next.js convention
config({ path: '.env.local' })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // DIRECT_URL bypasses PgBouncer — required for DDL migrations with Supabase
    url: process.env.DIRECT_URL ?? '',
  },
})
