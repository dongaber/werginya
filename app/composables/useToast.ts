export type ToastType = 'error' | 'success' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

const toasts = ref<Toast[]>([])
let counter = 0

export function useToast() {
  function show(message: string, type: ToastType = 'info', duration = 3500) {
    const id = ++counter
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), duration)
  }

  function remove(id: number) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  function error(message: string) { show(message, 'error') }
  function success(message: string) { show(message, 'success') }

  return { toasts, show, error, success, remove }
}
