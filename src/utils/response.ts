// Unified HTTP response helpers

import type { Context } from 'hono'
import type { AppEnv } from '../types'

export const ok = (c: Context<AppEnv>, data: unknown, msg = 'ok') =>
  c.json({ code: 0, msg, data })

export const fail = (c: Context<AppEnv>, msg: string, httpStatus: 400 | 401 | 403 | 404 | 500 = 400) =>
  c.json({ code: httpStatus, msg, data: null }, httpStatus)
