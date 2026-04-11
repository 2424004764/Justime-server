import { createRoute, z } from '@hono/zod-openapi'

const ErrorSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.null(),
})

const PresetSchema = z.object({
  title: z.string(),
  count: z.number(),
})

const GroupSchema = z.object({
  title: z.string(),
  count: z.number(),
  latest_at: z.string(),
})

export const listPresetsRoute = createRoute({
  method: 'get',
  path: '/presets',
  tags: ['Presets'],
  summary: '获取常用标题列表',
  description: '返回使用次数 >= 2 的标题，按使用频次降序',
  responses: {
    200: {
      description: '常用标题列表',
      content: {
        'application/json': {
          schema: z.object({
            code: z.number(),
            msg: z.string(),
            data: z.object({ data: z.array(PresetSchema) }),
          }),
        },
      },
    },
    401: { description: '未授权', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

export const listGroupsRoute = createRoute({
  method: 'get',
  path: '/groups',
  tags: ['Groups'],
  summary: '获取分组列表',
  description: '返回使用次数 >= 2 的标题分组，按最近活跃时间降序',
  responses: {
    200: {
      description: '分组列表',
      content: {
        'application/json': {
          schema: z.object({
            code: z.number(),
            msg: z.string(),
            data: z.object({ data: z.array(GroupSchema) }),
          }),
        },
      },
    },
    401: { description: '未授权', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

export const listGroupRecordsRoute = createRoute({
  method: 'get',
  path: '/groups/:title/records',
  tags: ['Groups'],
  summary: '获取分组下的记录',
  request: {
    params: z.object({ title: z.string() }),
    query: z.object({
      page: z.coerce.number().int().positive().optional(),
      page_size: z.coerce.number().int().positive().max(100).optional(),
    }),
  },
  responses: {
    200: {
      description: '分组记录列表',
      content: {
        'application/json': {
          schema: z.object({
            code: z.number(),
            msg: z.string(),
            data: z.object({
              data: z.array(
                z.object({
                  id: z.number(),
                  user_id: z.number(),
                  title: z.string().nullable(),
                  note: z.string().nullable(),
                  location: z.string().nullable(),
                  started_at: z.string(),
                  ended_at: z.string(),
                  duration: z.number(),
                  created_at: z.string(),
                }),
              ),
              total: z.number(),
              page: z.number(),
              page_size: z.number(),
            }),
          }),
        },
      },
    },
    401: { description: '未授权', content: { 'application/json': { schema: ErrorSchema } } },
  },
})
