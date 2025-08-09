import { EToast } from 'vue3-modern-toast'

/**
 * Composable pour la gestion de l'authentification et du token JWT
 */
export const useAuth = () => {
  // État réactif pour l'utilisateur connecté
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.isAdmin || false)

  /**
   * Récupérer le token JWT depuis le localStorage
   */
  const getJwtToken = (): string | null => {
    if (process.client) {
      return localStorage.getItem('jwtToken')
    }
    return null
  }

  /**
   * Récupérer les données utilisateur depuis le localStorage
   */
  const getUserData = () => {
    if (process.client) {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  /**
   * Initialiser l'état utilisateur depuis le localStorage
   */
  const initializeAuth = () => {
    if (process.client) {
      const userData = getUserData()
      if (userData) {
        user.value = userData
      }
    }
  }

  /**
   * Se déconnecter (nettoyer le localStorage)
   */
  const logout = () => {
    if (process.client) {
      localStorage.removeItem('user')
      localStorage.removeItem('jwtToken')
      user.value = null
    }
  }

  /**
   * Se déconnecter avec toast (à utiliser depuis les composants)
   */
  const logoutWithToast = () => {
    logout()
    
    if (process.client) {
      const { $toast } = useNuxtApp()
      
      // Afficher un toast de confirmation de déconnexion
      $toast.show({
        message: 'Vous avez été déconnecté avec succès',
        type: EToast.INFO,
        duration: 3000,
        dismissible: true,
        icon: '👋'
      })
    }
  }

  /**
   * Créer les headers d'autorisation pour les requêtes API
   */
  const getAuthHeaders = () => {
    const token = getJwtToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  /**
   * Faire une requête API authentifiée
   */
  const authenticatedFetch = async (url: string, options: any = {}) => {
    const authHeaders = getAuthHeaders()
    
    return await $fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...authHeaders,
      },
    })
  }

  /**
   * Faire une requête API authentifiée avec gestion d'erreurs et toasts
   */
  const authenticatedFetchWithToast = async (url: string, options: any = {}) => {
    const authHeaders = getAuthHeaders()
    
    try {
      return await $fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...authHeaders,
        },
      })
    } catch (error: any) {
      if (process.client) {
        const { $toast } = useNuxtApp()
        
        // Gestion des erreurs d'authentification
        if (error.status === 401) {
          $toast.show({
            message: 'Session expirée, veuillez vous reconnecter',
            type: EToast.WARNING,
            duration: 5000,
            dismissible: true,
            icon: '🔒'
          })
          
          // Déconnecter l'utilisateur si le token est expiré
          logout()
          await navigateTo('/login')
        } else if (error.status === 403) {
          $toast.show({
            message: 'Accès refusé - permissions insuffisantes',
            type: EToast.ERROR,
            duration: 5000,
            dismissible: true,
            icon: '🚫'
          })
        } else {
          $toast.show({
            message: error.data?.message || 'Une erreur est survenue',
            type: EToast.ERROR,
            duration: 5000,
            dismissible: true,
            icon: '❌'
          })
        }
      }
      
      throw error // Re-lancer l'erreur pour que l'appelant puisse la gérer
    }
  }

  // Initialiser au montage du composable
  if (process.client) {
    initializeAuth()
  }

  return {
    // État
    user: readonly(user),
    isLoggedIn,
    isAdmin,
    
    // Méthodes
    getJwtToken,
    getUserData,
    initializeAuth,
    logout,
    logoutWithToast,
    getAuthHeaders,
    authenticatedFetch,
    authenticatedFetchWithToast,
  }
}
