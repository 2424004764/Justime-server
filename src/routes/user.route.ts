import { createRoute, z } from '@hono/zod-openapi'

const UserSchema = z.object({
  id: z.number(),
  openid: z.string(),
  last_login_at: z.string(),
  created_at: z.string(),
})

const ErrorSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.null(),
})

export const userLoginRoute = createRoute({
  method: 'post',
  path: '/user/login',
  tags: ['User'],
  summary: '微信小程序登录',
  description: '传入微信 wx.login() 返回的 code，换取 openid 并登录或注册用户',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            code: z.string().min(1).openapi({ example: '023abc...' }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: '登录成功',
      content: {
        'application/json': {
          schema: z.object({
            code: z.number().openapi({ example: 0 }),
            msg: z.string().openapi({ example: 'ok' }),
            data: z.object({
              token: z.string().openapi({ description: '包含用户信息的 JWT' }),
              exp: z.number().openapi({ description: 'token 过期时间（Unix 时间戳）' }),
            }),
          }),
        },
      },
    },
    400: {
      description: '参数错误或微信接口异常',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})
