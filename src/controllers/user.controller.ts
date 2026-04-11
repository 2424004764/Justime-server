import type { Context } from 'hono'
import { UserService } from '../services/user.service'
import type { AppEnv } from '../types'
import { ok, fail } from '../utils/response'

export const UserController = {
  async login(c: Context<AppEnv>) {
    const body = await c.req.json<{ code?: string }>().catch(() => null)
    const code = body?.code
    if (!code) return fail(c, 'code is required')

    try {
      const user = await UserService.loginByCode(code, c.env)
      return ok(c, user)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'login failed'
      return fail(c, msg)
    }
  },
}
