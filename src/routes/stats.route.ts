import { createRoute, z } from '@hono/zod-openapi'

const ErrorSchema = z.object({ code: z.number(), msg: z.string(), data: z.null() })

export const getStatsRoute = createRoute({
  method: 'get',
  path: '/stats',
  tags: ['Stats'],
  summary: '获取统计数据',
  responses: {
    200: {
      description: '统计数据',
      content: {
        'application/json': {
          schema: z.object({
            code: z.number(),
            msg: z.string(),
            data: z.object({
              today_count: z.number().openapi({ description: '今日已记次数' }),
              total_hours: z.number().openapi({ description: '累计时长（小时）' }),
            }),
          }),
        },
      },
    },
    401: { description: '未授权', content: { 'application/json': { schema: ErrorSchema } } },
  },
})
