<template>
  <div class="page">
    <AppPageHeader title="Фильтр по технике" back />

    <div class="stub">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" class="stub__icon">
        <path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-7 3a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m6 13H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1z"/>
      </svg>
      <p class="stub__title">Скоро</p>
      <p class="stub__text">Фильтрация заявок по видам техники — видите только то, что вас интересует</p>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-bottom: 24px;
}

.stub {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 32px;
  text-align: center;
}

.stub__icon {
  color: var(--tg-hint);
  opacity: 0.4;
}

.stub__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--tg-text);
}

.stub__text {
  font-size: 14px;
  color: var(--tg-hint);
  line-height: 1.5;
}
</style>
