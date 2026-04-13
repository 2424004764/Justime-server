export interface Stats {
  today_count: number
  total_hours: number
}

export const StatsService = {
  async get(userId: number, env: Env): Promise<Stats> {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayStartISO = todayStart.toISOString()

    const todayRow = await env.DB.prepare(
      `SELECT COUNT(*) as count FROM records WHERE user_id = ? AND started_at >= ?`,
    )
      .bind(userId, todayStartISO)
      .first<{ count: number }>()

    const totalRow = await env.DB.prepare(
      `SELECT COALESCE(SUM(duration), 0) as total_seconds FROM records WHERE user_id = ?`,
    )
      .bind(userId)
      .first<{ total_seconds: number }>()

    return {
      today_count: todayRow?.count ?? 0,
      total_hours: Math.round(((totalRow?.total_seconds ?? 0) / 3600) * 100) / 100,
    }
  },
}
