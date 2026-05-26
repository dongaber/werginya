<template>
  <div class="trigger" @click="open = true">
    <span v-if="modelValue" class="trigger__value">{{ displayValue }}</span>
    <span v-else class="trigger__placeholder">Выберите дату и время</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" class="trigger__icon">
      <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V8h14z"/>
    </svg>
  </div>

  <AppBottomSheet v-model="open">
    <div class="picker">
      <!-- Calendar -->
      <div class="cal">
        <div class="cal__nav">
          <button class="cal__nav-btn" @click="prevMonth">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          </button>
          <span class="cal__month">{{ monthLabel }}</span>
          <button class="cal__nav-btn" @click="nextMonth">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        </div>

        <div class="cal__weekdays">
          <span v-for="d in weekdays" :key="d">{{ d }}</span>
        </div>

        <div class="cal__grid">
          <button
            v-for="(cell, i) in calendarCells"
            :key="i"
            class="cal__day"
            :class="{
              'cal__day--empty': cell === null,
              'cal__day--past': cell !== null && isPast(cell),
              'cal__day--today': cell !== null && isToday(cell),
              'cal__day--selected': cell !== null && isSelected(cell),
            }"
            :disabled="cell === null || isPast(cell)"
            @click="cell !== null && !isPast(cell) && selectDay(cell)"
          >{{ cell ?? '' }}</button>
        </div>
      </div>

      <!-- Time -->
      <div class="time">
        <span class="time__label">Время</span>
        <div class="drums">
          <div class="drum-wrap">
            <div ref="hourDrumEl" class="drum" @scroll.passive="onHourScroll">
              <div class="drum__pad" />
              <div
                v-for="h in hours"
                :key="h"
                class="drum__item"
                :class="{ 'drum__item--selected': h === selectedHour }"
              >{{ String(h).padStart(2, '0') }}</div>
              <div class="drum__pad" />
            </div>
            <div class="drum__overlay" />
          </div>

          <span class="drum-sep">:</span>

          <div class="drum-wrap">
            <div ref="minuteDrumEl" class="drum" @scroll.passive="onMinuteScroll">
              <div class="drum__pad" />
              <div
                v-for="m in minutes"
                :key="m"
                class="drum__item"
                :class="{ 'drum__item--selected': m === selectedMinute }"
              >{{ String(m).padStart(2, '0') }}</div>
              <div class="drum__pad" />
            </div>
            <div class="drum__overlay" />
          </div>
        </div>
      </div>

      <button class="confirm-btn" :disabled="selectedDay === null" @click="confirm">
        Готово
      </button>
    </div>
  </AppBottomSheet>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const ITEM_H = 44
const open = ref(false)

const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 12 }, (_, i) => i * 5)
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const monthNamesShort = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

const today = new Date()
today.setHours(0, 0, 0, 0)

const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())
const selectedDay = ref<number | null>(null)
const selectedMonth = ref(today.getMonth())
const selectedYear = ref(today.getFullYear())
const selectedHour = ref(9)
const selectedMinute = ref(0)

// Init from modelValue
watch(() => props.modelValue, (val) => {
  if (!val) return
  const d = new Date(val)
  if (isNaN(d.getTime())) return
  viewYear.value = d.getFullYear()
  viewMonth.value = d.getMonth()
  selectedYear.value = d.getFullYear()
  selectedMonth.value = d.getMonth()
  selectedDay.value = d.getDate()
  selectedHour.value = d.getHours()
  selectedMinute.value = Math.round(d.getMinutes() / 5) * 5 % 60
}, { immediate: true })

const monthLabel = computed(() => `${monthNames[viewMonth.value]} ${viewYear.value}`)

const daysInMonth = computed(() => new Date(viewYear.value, viewMonth.value + 1, 0).getDate())

const firstDayOffset = computed(() => {
  const d = new Date(viewYear.value, viewMonth.value, 1).getDay()
  return d === 0 ? 6 : d - 1
})

const calendarCells = computed<(number | null)[]>(() => {
  const cells: (number | null)[] = Array(firstDayOffset.value).fill(null)
  for (let d = 1; d <= daysInMonth.value; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
})

function isPast(day: number) {
  return new Date(viewYear.value, viewMonth.value, day) < today
}

function isToday(day: number) {
  return viewYear.value === today.getFullYear() && viewMonth.value === today.getMonth() && day === today.getDate()
}

function isSelected(day: number) {
  return selectedDay.value === day && selectedMonth.value === viewMonth.value && selectedYear.value === viewYear.value
}

function selectDay(day: number) {
  selectedDay.value = day
  selectedMonth.value = viewMonth.value
  selectedYear.value = viewYear.value
}

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}

function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
}

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const d = new Date(props.modelValue)
  if (isNaN(d.getTime())) return ''
  return `${d.getDate()} ${monthNamesShort[d.getMonth()]}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
})

// Drums
const hourDrumEl = ref<HTMLElement>()
const minuteDrumEl = ref<HTMLElement>()
let hourTimer: ReturnType<typeof setTimeout> | null = null
let minuteTimer: ReturnType<typeof setTimeout> | null = null

function onHourScroll(e: Event) {
  if (hourTimer) clearTimeout(hourTimer)
  hourTimer = setTimeout(() => {
    const el = e.target as HTMLElement
    const idx = Math.max(0, Math.min(Math.round(el.scrollTop / ITEM_H), hours.length - 1))
    selectedHour.value = hours[idx] ?? 0
  }, 80)
}

function onMinuteScroll(e: Event) {
  if (minuteTimer) clearTimeout(minuteTimer)
  minuteTimer = setTimeout(() => {
    const el = e.target as HTMLElement
    const idx = Math.max(0, Math.min(Math.round(el.scrollTop / ITEM_H), minutes.length - 1))
    selectedMinute.value = minutes[idx] ?? 0
  }, 80)
}

watch(open, (val) => {
  if (!val) return
  nextTick(() => {
    if (hourDrumEl.value) hourDrumEl.value.scrollTop = hours.indexOf(selectedHour.value) * ITEM_H
    if (minuteDrumEl.value) minuteDrumEl.value.scrollTop = minutes.indexOf(selectedMinute.value) * ITEM_H
  })
})

function confirm() {
  if (selectedDay.value === null) return
  const d = new Date(selectedYear.value, selectedMonth.value, selectedDay.value, selectedHour.value, selectedMinute.value)
  emit('update:modelValue', d.toISOString())
  open.value = false
}
</script>

<style scoped>
/* Trigger */
.trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--tg-hint) 30%, transparent);
  background: var(--tg-secondary-bg);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
}

.trigger__value {
  flex: 1;
  font-size: 15px;
  color: var(--tg-text);
  font-family: inherit;
}

.trigger__placeholder {
  flex: 1;
  font-size: 15px;
  color: var(--tg-hint);
  font-family: inherit;
}

.trigger__icon {
  flex-shrink: 0;
  color: var(--tg-hint);
}

/* Picker layout */
.picker {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Calendar */
.cal__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.cal__nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: color-mix(in srgb, var(--tg-hint) 10%, transparent);
  border-radius: 10px;
  color: var(--tg-text);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.cal__month {
  font-size: 15px;
  font-weight: 600;
  color: var(--tg-text);
}

.cal__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
}

.cal__weekdays span {
  text-align: center;
  font-size: 12px;
  color: var(--tg-hint);
  padding: 4px 0;
  font-weight: 500;
}

.cal__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.cal__day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  border-radius: 50%;
  font-size: 14px;
  color: var(--tg-text);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;
}

.cal__day--empty {
  pointer-events: none;
  visibility: hidden;
}

.cal__day--past {
  color: color-mix(in srgb, var(--tg-hint) 50%, transparent);
  cursor: default;
}

.cal__day--today {
  font-weight: 700;
  color: var(--tg-button);
}

.cal__day--selected {
  background: var(--tg-button);
  color: var(--tg-button-text) !important;
  font-weight: 600;
}

/* Time */
.time {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.time__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--tg-hint);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.drums {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.drum-sep {
  font-size: 22px;
  font-weight: 600;
  color: var(--tg-text);
  padding: 0 4px;
}

.drum-wrap {
  position: relative;
  width: 72px;
}

.drum-wrap::before,
.drum-wrap::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: color-mix(in srgb, var(--tg-hint) 25%, transparent);
  z-index: 2;
  pointer-events: none;
}

.drum-wrap::before { top: calc(50% - 22px); }
.drum-wrap::after  { top: calc(50% + 21px); }

.drum {
  height: 132px; /* 3 items */
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.drum::-webkit-scrollbar { display: none; }

.drum__pad {
  height: 44px;
  scroll-snap-align: none;
  flex-shrink: 0;
}

.drum__item {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--tg-hint);
  scroll-snap-align: center;
  transition: color 0.15s, font-weight 0.15s;
}

.drum__item--selected {
  color: var(--tg-text);
  font-weight: 600;
}

.drum__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    var(--tg-bg) 0%,
    transparent 35%,
    transparent 65%,
    var(--tg-bg) 100%
  );
  z-index: 1;
}

/* Confirm */
.confirm-btn {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: var(--tg-button);
  color: var(--tg-button-text);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.15s;
}

.confirm-btn:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
