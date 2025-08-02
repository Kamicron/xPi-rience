<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">Connexion</h2>
      
      <!-- Affichage des messages d'erreur -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div>
        <GoogleLoginButton />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Le composant GoogleLoginButton sera automatiquement importé par Nuxt

// Récupérer les paramètres d'URL pour afficher les erreurs
const route = useRoute()
const errorMessage = ref('')

// Vérifier les paramètres d'erreur et de succès dans l'URL
onMounted(async () => {
  const error = route.query.error
  const message = route.query.message
  const user = route.query.user
  
  // Gestion des erreurs
  if (error === 'user_not_registered') {
    errorMessage.value = message ? decodeURIComponent(message as string) : 'Utilisateur non enregistré'
  } else if (error === 'auth_failed') {
    errorMessage.value = 'Échec de l\'authentification'
  } else if (error === 'auth_error') {
    errorMessage.value = 'Erreur d\'authentification'
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
        console.log('✅ Token JWT stocké avec succès!')
      }
      
      // Rediriger vers la page d'accueil ou dashboard
      await navigateTo('/')
      
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error)
      errorMessage.value = 'Erreur lors de la récupération des données utilisateur'
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
.error-message {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  text-align: center;
}
</style>
