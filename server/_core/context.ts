import { CreateExpressContextOptions } from '@trpc/server/adapters/express'

export async function createContext(opts: CreateExpressContextOptions) {
  return {
    req: opts.req,
    res: opts.res,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
