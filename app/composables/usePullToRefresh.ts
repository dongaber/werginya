const THRESHOLD = 72
const RESISTANCE = 0.45

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const pullY = ref(0)
  const refreshing = ref(false)
  const progress = computed(() => Math.min(pullY.value / THRESHOLD, 1))

  let startY = 0
  let active = false

  function onTouchStart(e: TouchEvent) {
    if (window.scrollY > 0 || refreshing.value) return
    startY = e.touches[0]!.clientY
    active = true
  }

  function onTouchMove(e: TouchEvent) {
    if (!active) return
    const dy = e.touches[0]!.clientY - startY
    if (dy <= 0) {
      active = false
      return
    }
    pullY.value = Math.min(dy * RESISTANCE, THRESHOLD * 1.4)
    if (pullY.value > 4) e.preventDefault()
  }

  function onTouchEnd() {
    if (!active) return
    active = false
    if (pullY.value >= THRESHOLD) {
      trigger()
    } else {
      pullY.value = 0
    }
  }

  async function trigger() {
    refreshing.value = true
    pullY.value = THRESHOLD
    try {
      await onRefresh()
    } finally {
      refreshing.value = false
      pullY.value = 0
    }
  }

  onMounted(() => {
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    document.removeEventListener('touchstart', onTouchStart)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onTouchEnd)
  })

  return { pullY, refreshing, progress, THRESHOLD }
}
