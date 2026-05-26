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
      const result = await $fetch<any[]>('/api/requests', {
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

  watch(query, reset, { deep: true })

  onScopeDispose(() => observer?.disconnect())

  return { items, hasMore, loading, firstLoad, sentinel, reset }
}
