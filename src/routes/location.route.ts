import { createRoute, z } from '@hono/zod-openapi'

const ErrorSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.null(),
})

export const reverseGeocodeRoute = createRoute({
  method: 'get',
  path: '/location/reverse-geocode',
  tags: ['Location'],
  summary: '逆地理编码',
  description: '经纬度转地址描述',
  request: {
    query: z.object({
      lat: z.coerce.number().openapi({ example: 39.9042, description: '纬度' }),
      lng: z.coerce.number().openapi({ example: 116.4074, description: '经度' }),
    }),
  },
  responses: {
    200: {
      description: '地址信息',
      content: {
        'application/json': {
          schema: z.object({
            code: z.number(),
            msg: z.string(),
            data: z.object({ address: z.string() }).nullable(),
          }),
        },
      },
    },
    401: { description: '未授权', content: { 'application/json': { schema: ErrorSchema } } },
  },
})
