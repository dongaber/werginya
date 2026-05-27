interface RateLimitEntry {
  count: number
  reset: number
}

const store = new Map<string, RateLimitEntry>()

export function checkRateLimit(key: string, limit: number, windowMs: number): void {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs })
    return
  }

  if (entry.count >= limit) {
    throw createError({ statusCode: 429, message: 'Too Many Requests' })
  }

  entry.count++
}
