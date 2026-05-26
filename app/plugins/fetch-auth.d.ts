declare module '#app' {
  interface NuxtApp {
    $apiFetch: typeof $fetch
  }
}

export {}
