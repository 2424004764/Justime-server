import { z } from '@hono/zod-openapi'

export interface TimerRecord {
  id: number
  user_id: number
  title: string | null
  note: string | null
  location: string | null
  started_at: string
  ended_at: string
  duration: number
  created_at: string
}

export const CreateRecordSchema = z.object({
  started_at: z.string().openapi({ example: '2024-01-01T10:00:00.000Z', description: 'ISO 8601 开始时间' }),
  ended_at: z.string().openapi({ example: '2024-01-01T10:30:00.000Z', description: 'ISO 8601 结束时间' }),
  title: z.string().max(50).optional().openapi({ example: '上厕所' }),
  note: z.string().max(200).optional().openapi({ example: '备注内容' }),
  location: z.string().optional().openapi({ example: '北京市朝阳区' }),
})

export type CreateRecordInput = z.infer<typeof CreateRecordSchema>
