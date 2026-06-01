interface UserFilters {
  geoLat: number | null
  geoLng: number | null
  geoRadiusKm: number | null
  equipmentTypeIds: number[]
}

export function useUserFilters() {
  const filters = useState<UserFilters | null>('userFilters', () => null)
  const loading = ref(false)

  async function load() {
    if (filters.value !== null) return
    loading.value = true
    try {
      filters.value = await useNuxtApp().$apiFetch<UserFilters>('/api/user/filters')
    } catch {
      filters.value = { geoLat: null, geoLng: null, geoRadiusKm: null, equipmentTypeIds: [] }
    } finally {
      loading.value = false
    }
  }

  async function save(updates: Partial<UserFilters>) {
    await useNuxtApp().$apiFetch('/api/user/filters', { method: 'PATCH', body: updates })
    if (filters.value) {
      if (updates.geoLat !== undefined) filters.value.geoLat = updates.geoLat
      if (updates.geoLng !== undefined) filters.value.geoLng = updates.geoLng
      if (updates.geoRadiusKm !== undefined) filters.value.geoRadiusKm = updates.geoRadiusKm
      if (updates.equipmentTypeIds !== undefined) filters.value.equipmentTypeIds = updates.equipmentTypeIds
    }
  }

  function invalidate() {
    filters.value = null
  }

  return { filters, loading, load, save, invalidate }
}
