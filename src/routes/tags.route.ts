import { createRoute, z } from '@hono/zod-openapi'

const TagSuggestionSchema = z.object({
  title: z.string(),
  count: z.number(),
  last_used: z.string(),
})

const ErrorSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.null(),
})

export const getTagsRoute = createRoute({
  method: 'get',
  path: '/tags',
  tags: ['Tags'],
  summary: '获取历史标题建议',
  description: '返回使用次数 >= 2 的标题，按最近使用时间降序，最多 10 条',
  responses: {
    200: {
      description: '标题建议列表',
      content: {
        'application/json': {
          schema: z.object({
            code: z.number(),
            msg: z.string(),
            data: z.array(TagSuggestionSchema),
          }),
        },
      },
    },
    401: { description: '未授权', content: { 'application/json': { schema: ErrorSchema } } },
  },
})
