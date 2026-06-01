export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  if (to.path === '/register') return

  const userExists = useState('userExists', () => null as boolean | null)

  if (userExists.value === null) {
    try {
      const data = await $fetch<{ exists: boolean }>('/api/me')
      userExists.value = data.exists
    } catch {
      userExists.value = false
    }
  }

  if (!userExists.value) return navigateTo('/register')
})
