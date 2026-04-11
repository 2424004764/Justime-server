import type { User } from '../models/user.model'

export const UserService = {
  /**
   * 用微信 code 换取 openid，然后登录或注册用户
   * 环境变量：WX_APPID、WX_SECRET
   */
  async loginByCode(code: string, env: Env): Promise<User> {
    // 1. 换取 openid
    const url =
      `https://api.weixin.qq.com/sns/jscode2session` +
      `?appid=${env.WX_APPID}&secret=${env.WX_SECRET}` +
      `&js_code=${code}&grant_type=authorization_code`

    const res = await fetch(url)
    const wx = await res.json<{ openid?: string; errcode?: number; errmsg?: string }>()

    if (!wx.openid) {
      throw new Error(wx.errmsg ?? 'Failed to get openid')
    }

    const now = new Date().toISOString()
    const { openid } = wx

    // 2. 查询用户是否存在
    const existing = await env.DB.prepare(
      'SELECT * FROM users WHERE openid = ?'
    ).bind(openid).first<User>()

    if (existing) {
      // 3a. 已存在：更新最后登录时间
      await env.DB.prepare(
        'UPDATE users SET last_login_at = ? WHERE openid = ?'
      ).bind(now, openid).run()

      return { ...existing, last_login_at: now }
    }

    // 3b. 不存在：创建新用户
    const result = await env.DB.prepare(
      'INSERT INTO users (openid, last_login_at, created_at) VALUES (?, ?, ?)'
    ).bind(openid, now, now).run()

    return {
      id: result.meta.last_row_id as number,
      openid,
      last_login_at: now,
      created_at: now,
    }
  },
}
