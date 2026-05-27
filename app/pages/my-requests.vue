<template>
  <div class="page">
    <AppPullIndicator :pull-y="pullY" :progress="progress" :refreshing="refreshing" />

    <div class="page__header">
      <h1 class="page__title">Мои заявки</h1>
    </div>

    <!-- Status filter -->
    <div class="filters">
      <button
        v-for="f in filters"
        :key="f.value"
        class="filter-btn"
        :class="{ 'filter-btn--active': activeFilter === f.value }"
        @click="activeFilter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="firstLoad" class="loader">
      <AppSpinner :size="32" />
    </div>

    <template v-else>
      <div v-if="!items.length" class="empty">
        <p class="empty__text">У вас нет заявок</p>
        <NuxtLink to="/create" class="empty__btn">Создать заявку</NuxtLink>
      </div>

      <div v-else class="list">
        <AppRequestCard
          v-for="req in items"
          :key="req.id"
          :request="req"
          :is-owner="true"
          :action-loading="actionLoading === req.id"
          @action="handleAction"
        />

        <div ref="sentinel" class="sentinel" />

        <div v-if="loading" class="loader-more">
          <AppSpinner :size="24" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const activeFilter = ref<string>('ALL')

const filters = [
  { value: 'ALL', label: 'Все' },
  { value: 'PENDING', label: 'Черновик' },
  { value: 'PUBLISHED', label: 'Опубликована' },
  { value: 'DONE', label: 'Выполнена' },
  { value: 'CANCELLED', label: 'Отменена' },
]

const { error: showError, success: showSuccess } = useToast()

const query = computed(() => ({
  mine: true,
  ...(activeFilter.value !== 'ALL' ? { status: activeFilter.value } : {}),
}))

const { items, firstLoad, loading, sentinel, reset } = useInfiniteRequests(query)

const actionLoading = ref<number | null>(null)

async function handleAction(id: number, status: string) {
  actionLoading.value = id
  try {
    await $fetch(`/api/requests/${id}`, { method: 'PATCH', body: { status } })
    await reset()
    showSuccess('Статус заявки обновлён')
  } catch {
    showError('Не удалось обновить статус. Попробуйте ещё раз.')
  } finally {
    actionLoading.value = null
  }
}

const { pullY, progress, refreshing } = usePullToRefresh(reset)
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

.filters {
  display: flex;
  gap: 8px;
  padding: 0 16px 12px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filters::-webkit-scrollbar {
  display: none;
}

.filter-btn {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid color-mix(in srgb, var(--tg-hint) 25%, transparent);
  background: transparent;
  color: var(--tg-hint);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.filter-btn--active {
  border-color: var(--tg-button);
  background: color-mix(in srgb, var(--tg-button) 10%, transparent);
  color: var(--tg-button);
}

.loader {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 16px;
}

.empty__text {
  font-size: 15px;
  color: var(--tg-hint);
}

.empty__btn {
  padding: 12px 28px;
  border-radius: 12px;
  background: var(--tg-button);
  color: var(--tg-button-text);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
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
