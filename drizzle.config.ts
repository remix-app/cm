import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle',
  dialect: 'mysql2',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'mysql://localhost/community_manager',
  },
  migrations: {
    prefix: 'drizzle',
  },
  tablesFilter: ['!mysql_sequence'],
})
