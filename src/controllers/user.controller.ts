import { UserService } from '../services/user.service'
import type { AppEnv } from '../types'
import { ok, fail } from '../utils/response'
import { signToken } from '../utils/jwt'
import type { RouteHandler } from '@hono/zod-openapi'
import type { userLoginRoute } from '../routes/user.route.ts'

export const UserController = {
  login: (async (c) => {
    const { code } = c.req.valid('json')
    try {
      const user = await UserService.loginByCode(code, c.env)
      const { token, exp } = await signToken({ id: user.id }, c.env.JWT_SECRET)
      return ok(c, { id: user.id, token, exp })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'login failed'
      return fail(c, msg)
    }
  }) as RouteHandler<typeof userLoginRoute, AppEnv>,
}
