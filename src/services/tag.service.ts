export interface TagSuggestion {
  title: string
  count: number
  last_used: string
}

export const TagService = {
  async getSuggestions(userId: number, env: Env): Promise<TagSuggestion[]> {
    const rows = await env.DB.prepare(
      `SELECT title, COUNT(*) as count, MAX(started_at) as last_used
       FROM records
       WHERE user_id = ? AND title IS NOT NULL AND title != ''
       GROUP BY title
       HAVING count >= 2
       ORDER BY last_used DESC
       LIMIT 10`,
    )
      .bind(userId)
      .all<TagSuggestion>()

    return rows.results
  },
}
