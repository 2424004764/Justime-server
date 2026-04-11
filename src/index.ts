import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import { cors } from 'hono/cors'
import type { AppEnv } from './types'
import router from './routes'

const app = new OpenAPIHono<AppEnv>()

// CORS
app.use('*', cors())

// Health check
app.get('/', (c) => c.json({ status: 'ok' }))

// Mount API routes
app.route('/api', router)

// OpenAPI JSON spec
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: { title: 'Justime API', version: '1.0.0' },
})

// Scalar UI: 访问 /docs 查看接口文档
// 直接获取 spec 内容注入页面，避免 http URL 限制
app.get('/docs', async (c) => {
  const specRes = await app.request('/openapi.json')
  const spec = await specRes.json() as Record<string, unknown>
  return Scalar({ content: spec })(c as any, async () => {})
})

export default app
