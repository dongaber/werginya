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
        <AppRequestCard v-for="req in items" :key="req.id" :request="req" hide-status />

        <div ref="sentinel" class="sentinel" />

        <div v-if="loading" class="loader-more">
          <AppSpinner :size="24" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const query = computed(() => ({}))
const { items, firstLoad, loading, sentinel, reset } = useInfiniteRequests(query)

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
