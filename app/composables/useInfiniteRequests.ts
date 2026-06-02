const PAGE_SIZE = 20

export function useInfiniteRequests(query: ComputedRef<Record<string, any>>) {
  const items = ref<any[]>([])
  const cursor = ref<number | null>(null)
  const hasMore = ref(true)
  const loading = ref(false)
  const firstLoad = ref(true)
  const sentinel = ref<HTMLElement | null>(null)

  let observer: IntersectionObserver | null = null

  async function fetchPage() {
    if (loading.value || !hasMore.value) return
    loading.value = true
    try {
      const result = await useNuxtApp().$apiFetch<any[]>('/api/requests', {
        query: {
          ...query.value,
          take: PAGE_SIZE,
          ...(cursor.value !== null ? { cursor: cursor.value } : {}),
        },
      })
      if (result.length < PAGE_SIZE) hasMore.value = false
      if (result.length > 0) cursor.value = (result[result.length - 1] as any).id
      items.value.push(...result)
    } finally {
      loading.value = false
      firstLoad.value = false
    }
  }

  async function reset() {
    items.value = []
    cursor.value = null
    hasMore.value = true
    firstLoad.value = true
    await fetchPage()
  }

  watch(sentinel, (el, _, onCleanup) => {
    observer?.disconnect()
    if (!el) return
    observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) fetchPage() },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    onCleanup(() => observer?.disconnect())
  })

  if (import.meta.client) {
    watch(query, reset, { deep: true, immediate: true })
  }

  function updateItem(id: number, patch: Record<string, any>) {
    const idx = items.value.findIndex((item: any) => item.id === id)
    if (idx !== -1) items.value[idx] = { ...items.value[idx], ...patch }
  }

  onScopeDispose(() => observer?.disconnect())

  return { items, hasMore, loading, firstLoad, sentinel, reset, updateItem }
}
