import { ref, type Ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
}

const toasts = ref<Toast[]>([])
let toastId = 0

export function useToast(): {
  toasts: Ref<Toast[]>
  show: (message: string, type?: ToastType, duration?: number) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  remove: (id: number) => void
} {
  function show(message: string, type: ToastType = 'info', duration = 3000) {
    const id = ++toastId
    toasts.value.push({ id, message, type, duration })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  function success(message: string, duration = 3000) {
    show(message, 'success', duration)
  }

  function error(message: string, duration = 4000) {
    show(message, 'error', duration)
  }

  function warning(message: string, duration = 3500) {
    show(message, 'warning', duration)
  }

  function info(message: string, duration = 3000) {
    show(message, 'info', duration)
  }

  function remove(id: number) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    show,
    success,
    error,
    warning,
    info,
    remove,
  }
}
