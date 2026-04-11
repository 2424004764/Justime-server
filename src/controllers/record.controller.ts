import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { RecordService } from '../services/record.service'
import { ok, fail } from '../utils/response'
import type {
  listRecordsRoute,
  createRecordRoute,
  getRecordRoute,
  updateRecordRoute,
  deleteRecordRoute,
} from '../routes/records.route'

export const RecordController = {
  list: (async (c) => {
    const userId = c.get('userId')
    const { q, title, page, page_size } = c.req.valid('query')
    const result = await RecordService.list(userId, { q, title, page, page_size }, c.env)
    return ok(c, result)
  }) as RouteHandler<typeof listRecordsRoute, AppEnv>,

  create: (async (c) => {
    const userId = c.get('userId')
    const { started_at, ended_at, title, note, location } = c.req.valid('json')
    try {
      const record = await RecordService.create(userId, { started_at, ended_at, title, note, location }, c.env)
      return c.json({ code: 0, msg: 'ok', data: record }, 201)
    } catch (err: any) {
      if (err?.status === 422) return fail(c, err.message, 422)
      throw err
    }
  }) as RouteHandler<typeof createRecordRoute, AppEnv>,

  getById: (async (c) => {
    const userId = c.get('userId')
    const { id } = c.req.valid('param')
    const res = await RecordService.getById(id, userId, c.env)
    if (res.status === 404) return fail(c, 'not found', 404)
    if (res.status === 403) return fail(c, 'forbidden', 403)
    return ok(c, res.record)
  }) as RouteHandler<typeof getRecordRoute, AppEnv>,

  update: (async (c) => {
    const userId = c.get('userId')
    const { id } = c.req.valid('param')
    const data = c.req.valid('json')
    const res = await RecordService.update(id, userId, data, c.env)
    if (res.status === 404) return fail(c, 'not found', 404)
    if (res.status === 403) return fail(c, 'forbidden', 403)
    return ok(c, res.record)
  }) as RouteHandler<typeof updateRecordRoute, AppEnv>,

  remove: (async (c) => {
    const userId = c.get('userId')
    const { id } = c.req.valid('param')
    const res = await RecordService.remove(id, userId, c.env)
    if (res.status === 404) return fail(c, 'not found', 404)
    if (res.status === 403) return fail(c, 'forbidden', 403)
    return c.body(null, 204)
  }) as RouteHandler<typeof deleteRecordRoute, AppEnv>,
}
