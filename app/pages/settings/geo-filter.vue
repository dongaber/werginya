<template>
  <div class="page">
    <AppPageHeader title="Фильтр по гео" back />

    <div class="stub">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" class="stub__icon">
        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5"/>
      </svg>
      <p class="stub__title">Скоро</p>
      <p class="stub__text">Фильтрация заявок по городу или радиусу от вашего местоположения</p>
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
