<template>
  <div class="home-container">
    <div v-if="user">
      <UserProfile :user="user" />
      <button class="logout-button" @click="logout">Se déconnecter</button>
    </div>
    <div v-else>
      <p>Vous n'êtes pas connecté</p>
      <NuxtLink to="/login" class="login-link">Se connecter</NuxtLink>
    </div>
    <button @click="showTestToast">Show Toast</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { EToast } from 'vue3-modern-toast'
import { useEventBus } from '@vueuse/core'

const { logoutWithToast } = useAuth()
const { showSuccess, showToast } = useToast()
const eventBus = useEventBus('auth')

function showTestToast() {
  showSuccess('Hello World! ✨')
}
interface User {
  nom?: string;
  prenom?: string;
  email?: string;
  [key: string]: any;
}

const user = ref<User | null>(null);

onMounted(() => {
  // Récupérer les paramètres de l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const userParam = urlParams.get('user');
  let isNewConnection = false;
  
  if (userParam) {
    try {
      // Décoder et parser les données utilisateur
      const userData = JSON.parse(decodeURIComponent(userParam));
      user.value = userData;
      isNewConnection = true; // Nouvelle connexion détectée
      
      // Stocker les données dans le localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, '/');
      
      console.log('Nouvelle connexion détectée via paramètres URL');
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error);
    }
  } else {
    // Vérifier si l'utilisateur est déjà connecté
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
  }
  
  // Si c'est une nouvelle connexion via URL, afficher le toast immédiatement
  if (isNewConnection && user.value) {
    const userData = user.value as User;
    console.log('Nouvelle connexion détectée, affichage du toast pour:', userData);
    
    // Attendre un peu pour s'assurer que la page est bien chargée
    setTimeout(() => {
      showSuccess(`Bienvenue ${userData.nom || userData.prenom || userData.email || 'utilisateur'} !`, 4000);
    }, 500);
  }
  
  // Écouter les événements de connexion depuis d'autres pages
  eventBus.on('login-success', (userData: any) => {
    console.log('Événement login-success reçu:', userData);
    showToast(`Bienvenue ${userData.nom || userData.prenom || userData.email || 'utilisateur'} !`, EToast.SUCCESS, '🎉', 4000);
  });
});

const logout = () => {
  logoutWithToast()
  user.value = null
};
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  text-align: center;
}

.logout-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #c82333;
}

.login-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.login-link:hover {
  background-color: #0056b3;
}
</style>