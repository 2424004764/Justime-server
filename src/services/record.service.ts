import type { TimerRecord } from '../models/record.model'

export const RecordService = {
  async list(
    userId: number,
    params: { page?: number; page_size?: number; q?: string; title?: string },
    env: Env,
  ): Promise<{ data: TimerRecord[]; total: number; page: number; page_size: number }> {
    const page = params.page ?? 1
    const page_size = Math.min(params.page_size ?? 20, 100)
    const offset = (page - 1) * page_size

    const conditions: string[] = ['user_id = ?']
    const bindings: unknown[] = [userId]

    if (params.q && params.q.trim() !== '') {
      conditions.push("(title LIKE '%' || ? || '%' OR note LIKE '%' || ? || '%')")
      bindings.push(params.q, params.q)
    }

    if (params.title !== undefined && params.title !== '') {
      conditions.push('title = ?')
      bindings.push(params.title)
    }

    const where = conditions.join(' AND ')

    const countResult = await env.DB.prepare(`SELECT COUNT(*) as total FROM records WHERE ${where}`)
      .bind(...bindings)
      .first<{ total: number }>()

    const total = countResult?.total ?? 0

    const rows = await env.DB.prepare(
      `SELECT * FROM records WHERE ${where} ORDER BY started_at DESC LIMIT ? OFFSET ?`,
    )
      .bind(...bindings, page_size, offset)
      .all<TimerRecord>()

    return { data: rows.results, total, page, page_size }
  },

  async create(
    userId: number,
    data: {
      started_at: string
      ended_at: string
      title?: string
      note?: string
      location?: string
    },
    env: Env,
  ): Promise<TimerRecord> {
    const duration = Math.round(
      (new Date(data.ended_at).getTime() - new Date(data.started_at).getTime()) / 1000,
    )

    if (duration < 0) {
      throw Object.assign(new Error('ended_at must be >= started_at'), { status: 422 })
    }

    const created_at = new Date().toISOString()

    const result = await env.DB.prepare(
      `INSERT INTO records (user_id, title, note, location, started_at, ended_at, duration, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        userId,
        data.title ?? null,
        data.note ?? null,
        data.location ?? null,
        data.started_at,
        data.ended_at,
        duration,
        created_at,
      )
      .run()

    const record = await env.DB.prepare('SELECT * FROM records WHERE id = ?')
      .bind(result.meta.last_row_id)
      .first<TimerRecord>()

    return record!
  },

  async getById(
    id: number,
    userId: number,
    env: Env,
  ): Promise<{ status: 200; record: TimerRecord } | { status: 403 } | { status: 404 }> {
    const record = await env.DB.prepare('SELECT * FROM records WHERE id = ?')
      .bind(id)
      .first<TimerRecord>()

    if (!record) return { status: 404 }
    if (record.user_id !== userId) return { status: 403 }
    return { status: 200, record }
  },

  async update(
    id: number,
    userId: number,
    data: { title?: string | null; note?: string | null; location?: string | null },
    env: Env,
  ): Promise<{ status: 200; record: TimerRecord } | { status: 403 } | { status: 404 }> {
    const check = await this.getById(id, userId, env)
    if (check.status !== 200) return check

    const fields = Object.entries(data).filter(([, v]) => v !== undefined)
    if (fields.length > 0) {
      const setClauses = fields.map(([k]) => `${k} = ?`).join(', ')
      const values = fields.map(([, v]) => v)
      await env.DB.prepare(`UPDATE records SET ${setClauses} WHERE id = ?`)
        .bind(...values, id)
        .run()
    }

    const record = await env.DB.prepare('SELECT * FROM records WHERE id = ?')
      .bind(id)
      .first<TimerRecord>()

    return { status: 200, record: record! }
  },

  async remove(
    id: number,
    userId: number,
    env: Env,
  ): Promise<{ status: 204 } | { status: 403 } | { status: 404 }> {
    const check = await this.getById(id, userId, env)
    if (check.status !== 200) return check

    await env.DB.prepare('DELETE FROM records WHERE id = ?').bind(id).run()
    return { status: 204 }
  },
}
