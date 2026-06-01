export interface DadataSuggestion {
  value: string
  data: {
    geo_lat: string | null
    geo_lon: string | null
    city: string | null
    region_with_type: string | null
  }
}

export function useDadata() {
  const config = useRuntimeConfig()

  async function suggestAddress(query: string, cityOnly = false): Promise<DadataSuggestion[]> {
    const token = config.public.dadataToken
    if (!token || !query.trim() || query.length < 2) return []

    const body: Record<string, unknown> = { query, count: 7 }
    if (cityOnly) {
      body.from_bound = { value: 'city' }
      body.to_bound = { value: 'city' }
    }

    try {
      const res = await $fetch<{ suggestions: DadataSuggestion[] }>(
        'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          body,
        }
      )
      return res.suggestions ?? []
    } catch {
      return []
    }
  }

  return { suggestAddress }
}
