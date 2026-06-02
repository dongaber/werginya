<template>
  <div class="env-unsupported">
    <div class="env-unsupported__icon">✈️</div>
    <h1 class="env-unsupported__title">Откройте в Telegram</h1>
    <p class="env-unsupported__text">
      Это приложение работает только внутри Telegram Mini Apps.
    </p>
  </div>
</template>

<style scoped>
.env-unsupported {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 24px;
  text-align: center;
  gap: 12px;
}

.env-unsupported__icon {
  font-size: 64px;
  line-height: 1;
}

.env-unsupported__title {
  font-size: 20px;
  font-weight: 600;
}

.env-unsupported__text {
  font-size: 15px;
  opacity: 0.6;
  max-width: 280px;
}
</style>
