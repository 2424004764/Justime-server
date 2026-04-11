import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { ok, fail } from '../utils/response'
import { TagService } from '../services/tag.service'
import type { getTagsRoute } from '../routes/tags.route'

export const TagController = {
  getSuggestions: (async (c) => {
    const userId = c.get('userId')
    try {
      const tags = await TagService.getSuggestions(userId, c.env)
      return ok(c, tags)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'internal error'
      return fail(c, msg, 500)
    }
  }) as RouteHandler<typeof getTagsRoute, AppEnv>,
}
