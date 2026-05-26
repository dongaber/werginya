<template>
  <div class="page">
    <AppPullIndicator :pull-y="pullY" :progress="progress" :refreshing="refreshing" />

    <div class="page__header">
      <h1 class="page__title">Заявки</h1>
    </div>

    <div v-if="pending" class="loader">
      <AppSpinner :size="32" />
    </div>

    <div v-else-if="!filtered.length" class="empty">
      <p class="empty__text">Заявок нет</p>
    </div>

    <div v-else class="list">
      <AppRequestCard v-for="req in filtered" :key="req.id" :request="req" hide-status />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, pending, refresh } = await useFetch('/api/requests', {
  query: { status: 'PUBLISHED' },
})

const filtered = computed(() => (data.value as any[]) ?? [])

const { pullY, progress, refreshing } = usePullToRefresh(refresh)
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
</style>
