<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">Connexion</h2>
      
      <div>
        <GoogleLoginButton />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EToast } from 'vue3-modern-toast'
import { useEventBus } from '@vueuse/core'

// Le composant GoogleLoginButton sera automatiquement importé par Nuxt
const route = useRoute()
const { showError, showSuccess } = useToast()
const eventBus = useEventBus('auth')

// Vérifier les paramètres d'erreur et de succès dans l'URL
onMounted(async () => {
  const error = route.query.error
  const message = route.query.message
  const user = route.query.user
  
  // Gestion des erreurs avec toasts
  if (error === 'user_not_registered') {
    const errorMsg = message ? decodeURIComponent(message as string) : 'Utilisateur non enregistré'
    console.log('Tentative d\'affichage du toast d\'erreur:', errorMsg)
    showError(errorMsg)
  } else if (error === 'auth_failed') {
    console.log('Tentative d\'affichage du toast auth_failed')
    showError('Échec de l\'authentification')
  } else if (error === 'auth_error') {
    console.log('Tentative d\'affichage du toast auth_error')
    showError('Erreur d\'authentification')
  }
  
  // Gestion du succès de connexion
  if (user && !error) {
    try {
      const userData = JSON.parse(decodeURIComponent(user as string))
      
      // Stocker les données utilisateur dans le localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Si un token JWT est présent, le stocker séparément pour faciliter l'accès
      if (userData.jwtToken) {
        localStorage.setItem('jwtToken', userData.jwtToken)
      }
      
      // Émettre un événement de connexion réussie
      eventBus.emit('login-success', userData)
      
      // Rediriger vers la page d'accueil ou dashboard
      await navigateTo('/')
      
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error)
      showError('Erreur lors de la récupération des données utilisateur')
    }
  }
  
  // Nettoyer l'URL après avoir lu les paramètres
  if (error || user) {
    const newUrl = window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}
</style>
