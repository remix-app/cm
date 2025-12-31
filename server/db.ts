import { drizzle } from 'drizzle-orm/mysql2'
import { ENV } from './_core/env'

let _db: ReturnType<typeof drizzle> | null = null

export async function getDb() {
  if (!_db && ENV.DATABASE_URL) {
    try {
      _db = drizzle(ENV.DATABASE_URL)
    } catch (error) {
      console.warn('[Database] Connection failed:', error)
      _db = null
    }
  }
  return _db
}
