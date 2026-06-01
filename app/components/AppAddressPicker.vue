<template>
  <div class="picker">
    <!-- Input + dropdown wrapper -->
    <div class="picker__field">
      <input
        v-model="inputText"
        class="picker__input"
        :placeholder="placeholder ?? 'Введите адрес'"
        type="text"
        autocomplete="off"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
      <div v-if="showDropdown && suggestions.length" class="picker__dropdown">
        <button
          v-for="s in suggestions"
          :key="s.value"
          type="button"
          class="picker__item"
          @mousedown.prevent="pick(s)"
        >
          {{ s.value }}
        </button>
      </div>
    </div>

    <!-- Map (always visible when not cityOnly) -->
    <div v-if="!cityOnly" ref="mapEl" class="picker__map" />
  </div>
</template>

<script setup lang="ts">
import type { DadataSuggestion } from '~/composables/useDadata'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  cityOnly?: boolean
  initLat?: number | null
  initLng?: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [result: { value: string; lat: number | null; lng: number | null }]
}>()

const config = useRuntimeConfig()
const { suggestAddress } = useDadata()

const inputText = ref(props.modelValue)
const suggestions = ref<DadataSuggestion[]>([])
const showDropdown = ref(false)
const mapEl = ref<HTMLElement | null>(null)

let mapInstance: any = null
let markerInstance: any = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const DEFAULT_CENTER: [number, number] = [37.6156, 55.7522] // Moscow [lng, lat]
const DEFAULT_ZOOM = 9

watch(() => props.modelValue, (val) => {
  if (val !== inputText.value) inputText.value = val
})

watch(inputText, (val) => {
  emit('update:modelValue', val)
})

onMounted(async () => {
  if (props.cityOnly) return
  await nextTick()
  await initMap(props.initLat ?? null, props.initLng ?? null)
})

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
  mapInstance?.destroy?.()
  mapInstance = null
  markerInstance = null
})

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    suggestions.value = await suggestAddress(inputText.value, props.cityOnly)
    showDropdown.value = suggestions.value.length > 0
  }, 300)
}

function onFocus() {
  if (suggestions.value.length) showDropdown.value = true
}

function onBlur() {
  setTimeout(() => { showDropdown.value = false }, 150)
}

function pick(s: DadataSuggestion) {
  inputText.value = s.value
  showDropdown.value = false
  const lat = s.data.geo_lat ? parseFloat(s.data.geo_lat) : null
  const lng = s.data.geo_lon ? parseFloat(s.data.geo_lon) : null
  emit('select', { value: s.value, lat, lng })
  if (!props.cityOnly && lat && lng) {
    moveMap(lat, lng, 15)
  }
}

async function initMap(lat: number | null, lng: number | null) {
  if (!mapEl.value || props.cityOnly) return
  const key = config.public.yandexMapsKey as string
  if (!key) return

  const ymaps3 = await loadYandexMaps(key).catch(() => null)
  if (!ymaps3 || !mapEl.value) return

  const center: [number, number] = lat && lng ? [lng, lat] : DEFAULT_CENTER
  const zoom = lat && lng ? 15 : DEFAULT_ZOOM

  mapInstance = new ymaps3.YMap(mapEl.value, {
    location: { center, zoom },
  })
  mapInstance.addChild(new ymaps3.YMapDefaultSchemeLayer({}))
  mapInstance.addChild(new ymaps3.YMapDefaultFeaturesLayer({}))

  // Click listener
  mapInstance.addChild(new ymaps3.YMapListener({
    layer: 'any',
    onClick: (_obj: any, event: any) => {
      const [eLng, eLat] = event.coordinates
      setMarker(ymaps3, eLng, eLat)
      emit('select', { value: props.modelValue, lat: eLat, lng: eLng })
    },
  }))

  if (lat && lng) {
    setMarker(ymaps3, lng, lat)
  }
}

function setMarker(ymaps3: any, lng: number, lat: number) {
  const el = document.createElement('div')
  el.className = 'ymap-pin'

  if (markerInstance) {
    mapInstance?.removeChild(markerInstance)
  }
  markerInstance = new ymaps3.YMapMarker({ coordinates: [lng, lat] }, el)
  mapInstance?.addChild(markerInstance)
}

function moveMap(lat: number, lng: number, zoom = 15) {
  if (!mapInstance) return
  mapInstance.setLocation({ center: [lng, lat], zoom, duration: 400 })
  const ymaps3 = (window as any).ymaps3
  if (ymaps3) setMarker(ymaps3, lng, lat)
}
</script>

<style scoped>
.picker {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}

.picker__input {
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

.picker__field {
  position: relative;
}

.picker__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--tg-secondary-bg);
  border: 1px solid color-mix(in srgb, var(--tg-hint) 20%, transparent);
  border-radius: 12px;
  overflow: hidden;
  z-index: 100;
  box-shadow: 0 8px 24px color-mix(in srgb, #000 16%, transparent);
}

.picker__item {
  display: block;
  width: 100%;
  padding: 10px 14px;
  text-align: left;
  background: none;
  border: none;
  color: var(--tg-text);
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  line-height: 1.4;
  -webkit-tap-highlight-color: transparent;
  border-bottom: 1px solid color-mix(in srgb, var(--tg-hint) 10%, transparent);
}

.picker__item:last-child {
  border-bottom: none;
}

.picker__item:active {
  background: color-mix(in srgb, var(--tg-hint) 10%, transparent);
}

.picker__map {
  width: 100%;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--tg-hint) 20%, transparent);
}
</style>

<style>
.ymap-pin {
  width: 18px;
  height: 18px;
  background: var(--tg-button, #2481cc);
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  transform: translate(-50%, -50%);
  cursor: pointer;
}
</style>
