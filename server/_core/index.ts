import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from '../routers'
import { createContext } from './context'
import { ENV } from './env'

const app = express()
const server = createServer(app)

app.use(helmet())
app.use(cors({
  origin: ENV.APP_URL,
  credentials: true,
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})

app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist/public'))
  app.get('*', (req, res) => {
    res.sendFile('dist/public/index.html')
  })
}

const PORT = ENV.PORT

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`)
})

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0)
  })
})
