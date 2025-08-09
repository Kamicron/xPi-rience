import { EToast } from 'vue3-modern-toast'

/**
 * Composable pour gérer les toasts de manière centralisée
 */
export const useToast = () => {
  const showToast = (message: string, type: any = EToast.INFO, icon: string = 'ℹ️', duration: number = 3000) => {
    try {
      // Essayer d'utiliser le toast depuis useNuxtApp
      const { $toast } = useNuxtApp()
      
      if ($toast && typeof $toast.show === 'function') {
        $toast.show({
          message,
          type,
          duration,
          dismissible: true,
          icon
        })
        return true
      }
    } catch (error) {
      console.error('Erreur avec le système de toast:', error)
    }
    
    // Fallback : utiliser une notification native du navigateur
    try {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(message)
          return true
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification(message)
            }
          })
          return true
        }
      }
    } catch (error) {
      console.error('Erreur avec les notifications:', error)
    }
    
    // Dernier fallback : alert
    alert(message)
    return false
  }

  const showSuccess = (message: string, duration: number = 3000) => {
    return showToast(message, EToast.SUCCESS, '🎉', duration)
  }

  const showError = (message: string, duration: number = 5000) => {
    return showToast(message, EToast.ERROR, '❌', duration)
  }

  const showWarning = (message: string, duration: number = 4000) => {
    return showToast(message, EToast.WARNING, '⚠️', duration)
  }

  const showInfo = (message: string, duration: number = 3000) => {
    return showToast(message, EToast.INFO, 'ℹ️', duration)
  }

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
