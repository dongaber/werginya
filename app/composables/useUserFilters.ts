interface UserFilters {
  geoCity: string | null
  equipmentTypeIds: number[]
}

export function useUserFilters() {
  const filters = useState<UserFilters | null>('userFilters', () => null)
  const loading = ref(false)

  async function load() {
    if (filters.value !== null) return
    loading.value = true
    try {
      filters.value = await $fetch<UserFilters>('/api/user/filters')
    } catch {
      filters.value = { geoCity: null, equipmentTypeIds: [] }
    } finally {
      loading.value = false
    }
  }

  async function save(updates: Partial<UserFilters>) {
    await $fetch('/api/user/filters', { method: 'PATCH', body: updates })
    if (filters.value) {
      if (updates.geoCity !== undefined) filters.value.geoCity = updates.geoCity
      if (updates.equipmentTypeIds !== undefined) filters.value.equipmentTypeIds = updates.equipmentTypeIds
    }
  }

  function invalidate() {
    filters.value = null
  }

  return { filters, loading, load, save, invalidate }
}
