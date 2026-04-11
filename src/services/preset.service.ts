import type { Group, Preset } from '../models/preset.model'

export const PresetService = {
  async listPresets(userId: number, env: Env): Promise<Preset[]> {
    const rows = await env.DB.prepare(
      `SELECT title, COUNT(*) as count FROM records
       WHERE user_id = ? AND title IS NOT NULL
       GROUP BY title HAVING count >= 2
       ORDER BY count DESC`,
    )
      .bind(userId)
      .all<Preset>()

    return rows.results
  },

  async listGroups(userId: number, env: Env): Promise<Group[]> {
    const rows = await env.DB.prepare(
      `SELECT title, COUNT(*) as count, MAX(started_at) as latest_at FROM records
       WHERE user_id = ? AND title IS NOT NULL
       GROUP BY title HAVING count >= 2
       ORDER BY latest_at DESC`,
    )
      .bind(userId)
      .all<Group>()

    return rows.results
  },
}
