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
    getAuthHeaders,
    authenticatedFetch,
  }
}
