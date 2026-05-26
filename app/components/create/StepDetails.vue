<template>
  <div class="step">
    <!-- Equipment type selector (rental + transportation) -->
    <template v-if="type === 'RENTAL' || type === 'TRANSPORTATION'">
      <AppFormField label="Вид техники">
        <div class="equipment-list">
          <button
            v-for="eq in equipmentTypes"
            :key="eq.id"
            class="eq-item"
            :class="{ 'eq-item--active': form.equipmentTypeId === eq.id }"
            @click="form.equipmentTypeId = eq.id"
          >
            <img :src="eq.icon" :alt="eq.name" class="eq-item__icon" />
            <span class="eq-item__name">{{ eq.name }}</span>
          </button>
        </div>
      </AppFormField>
    </template>

    <!-- Cargo (transportation + delivery) -->
    <template v-if="type === 'TRANSPORTATION' || type === 'DELIVERY'">
      <AppFormField label="Груз">
        <textarea v-model="form.cargo" class="input input--textarea" placeholder="Опишите груз" rows="3" />
      </AppFormField>
    </template>

    <!-- From address (transportation) -->
    <template v-if="type === 'TRANSPORTATION'">
      <AppFormField label="Откуда">
        <input v-model="form.fromAddress" class="input" placeholder="Адрес отправления" />
      </AppFormField>
    </template>

    <!-- To address (rental + transportation + delivery) -->
    <AppFormField :label="type === 'RENTAL' ? 'Куда' : 'Куда'">
      <input
        v-model="toAddress"
        class="input"
        placeholder="Адрес назначения"
      />
    </AppFormField>

    <!-- Date/time -->
    <AppFormField label="Когда">
      <AppDatePicker v-model="form.startsAt" />
    </AppFormField>

    <!-- Duration (rental) -->
    <template v-if="type === 'RENTAL'">
      <AppFormField label="Срок (дней)">
        <input v-model.number="form.durationDays" class="input" type="number" min="1" placeholder="1" />
      </AppFormField>
    </template>

    <!-- Rate (transportation) -->
    <template v-if="type === 'TRANSPORTATION'">
      <AppFormField label="Ставка (₽/час)">
        <input v-model.number="form.ratePerHour" class="input" type="number" min="0" placeholder="1000" />
      </AppFormField>
    </template>

    <!-- Volume (delivery) -->
    <template v-if="type === 'DELIVERY'">
      <AppFormField label="Объём">
        <input v-model="form.volume" class="input" placeholder="Например: 5 тонн, 10 м³" />
      </AppFormField>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ type: string; form: Record<string, any> }>()

const { data: equipmentTypes } = await useFetch<{ id: number; name: string; icon: string }[]>(
  '/api/equipment-types'
)

const toAddress = computed({
  get: () => (props.type === 'RENTAL' ? props.form.address : props.form.toAddress),
  set: (v) => {
    if (props.type === 'RENTAL') props.form.address = v
    else props.form.toAddress = v
  },
})
</script>

<style scoped>
.input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--tg-hint) 30%, transparent);
  background: var(--tg-secondary-bg);
  color: var(--tg-text);
  font-size: 15px;
  outline: none;
  font-family: inherit;
}

.input--textarea {
  resize: none;
}

.equipment-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.eq-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 6px;
  border-radius: 12px;
  border: 2px solid color-mix(in srgb, var(--tg-hint) 20%, transparent);
  background: var(--tg-secondary-bg);
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.eq-item--active {
  border-color: var(--tg-button);
  background: color-mix(in srgb, var(--tg-button) 8%, var(--tg-secondary-bg));
}

.eq-item__icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.eq-item__name {
  font-size: 10px;
  color: var(--tg-text);
  text-align: center;
  line-height: 1.2;
}
</style>
