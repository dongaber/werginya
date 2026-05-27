<template>
  <div class="page">
    <AppPullIndicator :pull-y="pullY" :progress="progress" :refreshing="refreshing" />

    <div class="page__header">
      <h1 class="page__title">Заявки</h1>
    </div>

    <div v-if="firstLoad" class="loader">
      <AppSpinner :size="32" />
    </div>

    <template v-else>
      <div v-if="!items.length" class="empty">
        <p class="empty__text">Заявок нет</p>
      </div>

      <div v-else class="list">
        <AppRequestCard
          v-for="req in items"
          :key="req.id"
          :request="req"
          hide-status
          :view-loading="viewLoading === req.id"
          :can-view-contacts="canViewContacts"
          :views-remaining="viewsRemaining"
          :subscription-active="me?.subscriptionActive"
          @view-contacts="handleViewContacts"
          @subscribe="showSubscriptionModal = true"
        />

        <div ref="sentinel" class="sentinel" />

        <div v-if="loading" class="loader-more">
          <AppSpinner :size="24" />
        </div>
      </div>
    </template>

    <AppSubscriptionModal v-model="showSubscriptionModal" />
  </div>
</template>

<script setup lang="ts">
const { filters, load: loadFilters } = useUserFilters()
const { me, load: loadMe, canViewContacts, viewsRemaining, incrementViewCount } = useMe()
const { error: showError } = useToast()
const showSubscriptionModal = ref(false)

if (import.meta.client) {
  loadFilters()
  loadMe()
}

const query = computed(() => ({
  ...(filters.value?.geoCity ? { geoCity: filters.value.geoCity } : {}),
  ...(filters.value?.equipmentTypeIds?.length ? { equipmentTypeIds: filters.value.equipmentTypeIds } : {}),
}))

const { items, firstLoad, loading, sentinel, reset, updateItem } = useInfiniteRequests(query)
const { pullY, progress, refreshing } = usePullToRefresh(reset)

const viewLoading = ref<number | null>(null)

async function handleViewContacts(id: number) {
  viewLoading.value = id
  try {
    const contacts = await $fetch(`/api/requests/${id}/view-contacts`, { method: 'POST' })
    updateItem(id, { ...contacts, contactsUnlocked: true })
    incrementViewCount()
  } catch (err: any) {
    if (err?.data?.reason === 'limit_reached') {
      showSubscriptionModal.value = true
    } else {
      showError('Не удалось открыть контакты')
    }
  } finally {
    viewLoading.value = null
  }
}
</script>

<style scoped>
.page {
  padding-bottom: 16px;
}

.page__header {
  padding: 16px 16px 8px;
}

.page__title {
  font-size: 22px;
  font-weight: 700;
}

.loader {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.empty {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.empty__text {
  font-size: 15px;
  color: var(--tg-hint);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 16px;
}

.sentinel {
  height: 1px;
}

.loader-more {
  display: flex;
  justify-content: center;
  padding: 12px 0;
}
</style>
