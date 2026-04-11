import { Hono } from 'hono'
import type { AppEnv } from './types'
import router from './routes'

const app = new Hono<AppEnv>()

// Health check
app.get('/', (c) => c.json({ status: 'ok' }))

// Mount API routes
app.route('/api', router)

export default app
