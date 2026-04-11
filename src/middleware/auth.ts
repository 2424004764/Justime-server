import type { MiddlewareHandler } from 'hono'
import type { AppEnv } from '../types'
import { fail } from '../utils/response'

async function verifyJWT(token: string, secret: string): Promise<Record<string, unknown>> {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('invalid token')

  const [header, payload, sig] = parts
  const data = `${header}.${payload}`

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  // base64url decode signature
  const sigBytes = Uint8Array.from(
    atob(sig.replace(/-/g, '+').replace(/_/g, '/')),
    (c) => c.charCodeAt(0)
  )

  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data))
  if (!valid) throw new Error('invalid signature')

  const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as Record<string, unknown>

  // Check expiration
  if (decoded.exp && typeof decoded.exp === 'number') {
    if (Math.floor(Date.now() / 1000) > decoded.exp) {
      throw new Error('token expired')
    }
  }

  return decoded
}

export const authMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  const authHeader = c.req.header('authorization') ?? c.req.header('Authorization') ?? c.req.raw.headers.get('authorization')
  let token: string | null = null
  if (authHeader) {
    token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader
  }

  if (!token) {
    return fail(c, 'Unauthorized', 401)
  }

  try {
    const payload = await verifyJWT(token, c.env.JWT_SECRET)
    c.set('userId', payload.id as number)
    await next()
  } catch (e) {
    console.error('[auth] verify failed:', e)
    return fail(c, 'Unauthorized', 401)
  }
}
