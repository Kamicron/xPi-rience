import { defineNuxtPlugin } from '#app'
import VueToast, { createToast } from 'vue3-modern-toast'
import 'vue3-modern-toast/dist/style.css'

declare module '#app' {
  interface NuxtApp {
    $toast: ReturnType<typeof createToast>
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueToast)
  
  const toast = createToast()
  
  return {
    provide: {
      toast
    }
  }
})