import { createRoute, z } from '@hono/zod-openapi'
import { CreateRecordSchema } from '../models/record.model'

export const TimerRecordSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string().nullable(),
  note: z.string().nullable(),
  location: z.string().nullable(),
  started_at: z.string(),
  ended_at: z.string(),
  duration: z.number(),
  created_at: z.string(),
})

const ErrorSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.null(),
})

const PaginatedRecordsSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.object({
    data: z.array(TimerRecordSchema),
    total: z.number(),
    page: z.number(),
    page_size: z.number(),
  }),
})

export const listRecordsRoute = createRoute({
  method: 'get',
  path: '/records',
  tags: ['Records'],
  summary: '获取记录列表',
  request: {
    query: z.object({
      q: z.string().min(1).optional().openapi({ description: '搜索关键词（模糊匹配标题和备注）' }),
      title: z.string().optional().openapi({ description: '按标题精确过滤' }),
      page: z.coerce.number().int().positive().optional(),
      page_size: z.coerce.number().int().positive().max(100).optional(),
    }),
  },
  responses: {
    200: {
      description: '记录列表',
      content: { 'application/json': { schema: PaginatedRecordsSchema } },
    },
    400: { description: '参数错误', content: { 'application/json': { schema: ErrorSchema } } },
    401: { description: '未授权', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

export const createRecordRoute = createRoute({
  method: 'post',
  path: '/records',
  tags: ['Records'],
  summary: '创建计时记录',
  request: {
    body: {
      content: { 'application/json': { schema: CreateRecordSchema } },
    },
  },
  responses: {
    201: {
      description: '创建成功',
      content: {
        'application/json': {
          schema: z.object({ code: z.number(), msg: z.string(), data: TimerRecordSchema }),
        },
      },
    },
    400: { description: '参数错误', content: { 'application/json': { schema: ErrorSchema } } },
    401: { description: '未授权', content: { 'application/json': { schema: ErrorSchema } } },
    422: { description: '时间范围错误', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

export const getRecordRoute = createRoute({
  method: 'get',
  path: '/records/:id',
  tags: ['Records'],
  summary: '获取单条记录',
  request: {
    params: z.object({ id: z.coerce.number().int().positive() }),
  },
  responses: {
    200: {
      description: '记录详情',
      content: {
        'application/json': {
          schema: z.object({ code: z.number(), msg: z.string(), data: TimerRecordSchema }),
        },
      },
    },
    401: { description: '未授权', content: { 'application/json': { schema: ErrorSchema } } },
    403: { description: '无权访问', content: { 'application/json': { schema: ErrorSchema } } },
    404: { description: '记录不存在', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

export const updateRecordRoute = createRoute({
  method: 'patch',
  path: '/records/:id',
  tags: ['Records'],
  summary: '更新计时记录',
  request: {
    params: z.object({ id: z.coerce.number().int().positive() }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            title: z.string().max(50).nullable().optional().openapi({ example: '到公司' }),
            note: z.string().max(500).nullable().optional().openapi({ example: '备注' }),
            location: z.string().max(200).nullable().optional().openapi({ example: '北京市朝阳区' }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: '更新成功',
      content: {
        'application/json': {
          schema: z.object({ code: z.number(), msg: z.string(), data: TimerRecordSchema }),
        },
      },
    },
    401: { description: '未授权', content: { 'application/json': { schema: ErrorSchema } } },
    403: { description: '无权访问', content: { 'application/json': { schema: ErrorSchema } } },
    404: { description: '记录不存在', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

export const deleteRecordRoute = createRoute({
  method: 'delete',
  path: '/records/:id',
  tags: ['Records'],
  summary: '删除记录',
  request: {
    params: z.object({ id: z.coerce.number().int().positive() }),
  },
  responses: {
    204: { description: '删除成功' },
    401: { description: '未授权', content: { 'application/json': { schema: ErrorSchema } } },
    403: { description: '无权访问', content: { 'application/json': { schema: ErrorSchema } } },
    404: { description: '记录不存在', content: { 'application/json': { schema: ErrorSchema } } },
  },
})
