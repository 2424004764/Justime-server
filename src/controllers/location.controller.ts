import type { RouteHandler } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { ok, fail } from '../utils/response'
import { LocationService } from '../services/location.service'
import type { reverseGeocodeRoute } from '../routes/location.route'

export const LocationController = {
  reverseGeocode: (async (c) => {
    const { lat, lng } = c.req.valid('query')
    try {
      const address = await LocationService.reverseGeocode(lat, lng, c.env)
      return ok(c, { address })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'geocode failed'
      return fail(c, msg, 400)
    }
  }) as RouteHandler<typeof reverseGeocodeRoute, AppEnv>,
}
