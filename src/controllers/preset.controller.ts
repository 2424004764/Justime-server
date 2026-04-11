import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { PresetService } from '../services/preset.service'
import { ok } from '../utils/response'
import { RecordService } from '../services/record.service'
import type {
  listPresetsRoute,
  listGroupsRoute,
  listGroupRecordsRoute,
} from '../routes/preset.route'

export const PresetController = {
  listPresets: (async (c) => {
    const userId = c.get('userId')
    const data = await PresetService.listPresets(userId, c.env)
    return ok(c, { data })
  }) as RouteHandler<typeof listPresetsRoute, AppEnv>,

  listGroups: (async (c) => {
    const userId = c.get('userId')
    const data = await PresetService.listGroups(userId, c.env)
    return ok(c, { data })
  }) as RouteHandler<typeof listGroupsRoute, AppEnv>,

  listGroupRecords: (async (c) => {
    const userId = c.get('userId')
    const { title } = c.req.valid('param')
    const { page, page_size } = c.req.valid('query')
    const result = await RecordService.list(userId, { title, page, page_size }, c.env)
    return ok(c, result)
  }) as RouteHandler<typeof listGroupRecordsRoute, AppEnv>,
}
