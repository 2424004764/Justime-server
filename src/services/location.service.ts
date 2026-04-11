interface TencentGeocodeResponse {
  status: number
  message: string
  result?: {
    address: string
    address_component?: {
      nation: string
      province: string
      city: string
      district: string
      street: string
      street_number: string
    }
  }
}

export const LocationService = {
  async reverseGeocode(lat: number, lng: number, env: Env): Promise<string> {
    const key = env.TENCENT_MAP_KEY
    if (!key) {
      throw new Error('TENCENT_MAP_KEY not configured')
    }

    const url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=${key}`
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Geocode request failed: ${res.status}`)
    }

    const data = (await res.json()) as TencentGeocodeResponse

    if (data.status !== 0 || !data.result?.address) {
      throw new Error(data.message || 'Geocode failed')
    }

    return data.result.address
  },
}
