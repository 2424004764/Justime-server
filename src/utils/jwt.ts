const EXPIRES_IN = 60 * 60 * 24 * 7 // 7天，单位秒

function base64url(data: string): string {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function signToken(payload: Record<string, unknown>, secret: string) {
  const exp = Math.floor(Date.now() / 1000) + EXPIRES_IN
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64url(JSON.stringify({ ...payload, exp }))
  const data = `${header}.${body}`

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const sigBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

  return { token: `${data}.${sig}`, exp }
}
