import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32).default('dev-secret-key-change-in-production'),
  APP_URL: z.string().default('http://localhost:3000'),
})

export type EnvType = z.infer<typeof envSchema>

let _env: EnvType | null = null

function getEnv(): EnvType {
  if (!_env) {
    const result = envSchema.safeParse(process.env)
    if (!result.success) {
      console.warn('Errores en variables de entorno:', result.error.errors)
    }
    _env = result.data || envSchema.parse({})
  }
  return _env
}

export const ENV = getEnv()
