const CONTACT_VIEW_LIMIT = 5

interface Me {
  isAdmin: boolean
  subscriptionActive: boolean
  contactViewCount: number
}

export function useMe() {
  const me = useState<Me | null>('me', () => null)

  async function load() {
    if (me.value !== null) return
    try {
      me.value = await $fetch<Me>('/api/me')
    } catch {
      me.value = { isAdmin: false, subscriptionActive: false, contactViewCount: 0 }
    }
  }

  function incrementViewCount() {
    if (me.value) me.value.contactViewCount++
  }

  const canViewContacts = computed(() =>
    !me.value || me.value.subscriptionActive || me.value.contactViewCount < CONTACT_VIEW_LIMIT
  )

  const viewsRemaining = computed(() =>
    me.value ? Math.max(0, CONTACT_VIEW_LIMIT - me.value.contactViewCount) : CONTACT_VIEW_LIMIT
  )

  return { me, load, incrementViewCount, canViewContacts, viewsRemaining }
}
