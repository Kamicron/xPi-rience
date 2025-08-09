<template>
  <div class="profile-container">
    <!-- Loading state -->
    <div v-if="loading" class="loading">
      <p>Chargement du profil...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadProfile" class="retry-btn">Réessayer</button>
    </div>

    <!-- Profile content -->
    <div v-else-if="currentProfile" class="profile-content">
      <!-- View mode -->
      <div v-if="!isEditing" class="profile-view">
        <div class="profile-header">
          <div class="profile-avatar">
            {{ getInitials(currentProfile) }}
          </div>
          <div class="profile-info">
            <h2>{{ getFullName(currentProfile) }}</h2>
            <p class="profile-title">{{ currentProfile.title }}</p>
            <p class="profile-description">{{ currentProfile.description }}</p>
          </div>
          <button @click="startEditing" class="edit-btn">Modifier</button>
        </div>
      </div>

      <!-- Edit mode -->
      <div v-else class="profile-edit">
        <form @submit.prevent="saveProfile" class="edit-form">
          <div class="form-group">
            <label for="firstName">Prénom :</label>
            <input 
              id="firstName"
              v-model="editForm.firstName" 
              type="text" 
              required
              :disabled="saving"
            />
          </div>
          
          <div class="form-group">
            <label for="name">Nom :</label>
            <input 
              id="name"
              v-model="editForm.name" 
              type="text" 
              required
              :disabled="saving"
            />
          </div>
          
          <div class="form-group">
            <label for="title">Titre :</label>
            <input 
              id="title"
              v-model="editForm.title" 
              type="text" 
              required
              :disabled="saving"
            />
          </div>
          
          <div class="form-group">
            <label for="description">Description :</label>
            <textarea 
              id="description"
              v-model="editForm.description" 
              required
              :disabled="saving"
              rows="4"
            ></textarea>
          </div>

          <div v-if="validationErrors.length > 0" class="validation-errors">
            <ul>
              <li v-for="error in validationErrors" :key="error">{{ error }}</li>
            </ul>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelEditing" :disabled="saving" class="cancel-btn">
              Annuler
            </button>
            <button type="submit" :disabled="saving || validationErrors.length > 0" class="save-btn">
              {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- No profile state -->
    <div v-else class="no-profile">
      <p>Aucun profil trouvé</p>
    </div>
  </div>
</template>

<script setup lang="ts">

// Composables
const { fetchProfiles, editProfile } = useProfilesState();
const { validateProfileData, getFullName, sanitizeProfileData, hasProfileChanged } = useProfilesUtils();

// État réactif
const profiles = ref<Profile[]>([]);
const currentProfile = ref<Profile | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const isEditing = ref(false);
const saving = ref(false);

onMounted(() => {
  loadProfile();
});

// Formulaire d'édition
const editForm = ref<UpdateProfileDto>({
  name: '',
  firstName: '',
  title: '',
  description: ''
});

// Erreurs de validation
const validationErrors = computed(() => {
  if (!isEditing.value) return [];
  return validateProfileData(editForm.value);
});

// Charger le profil
const loadProfile = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    profiles.value = await fetchProfiles();

    console.log('profiles.value', profiles.value)
    if (profiles.value && profiles.value.length > 0) {
      currentProfile.value = profiles.value[0];
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors du chargement du profil';
    console.error('Erreur loadProfile:', err);
  } finally {
    loading.value = false;
  }
};

// Commencer l'édition
const startEditing = () => {
  if (!currentProfile.value) return;
  
  editForm.value = {
    name: currentProfile.value.name,
    firstName: currentProfile.value.firstName,
    title: currentProfile.value.title,
    description: currentProfile.value.description
  };
  
  isEditing.value = true;
};

// Annuler l'édition
const cancelEditing = () => {
  isEditing.value = false;
  editForm.value = {
    name: '',
    firstName: '',
    title: '',
    description: ''
  };
};

// Sauvegarder le profil
const saveProfile = async () => {
  if (!currentProfile.value || validationErrors.value.length > 0) return;
  
  // Vérifier s'il y a des changements
  if (!hasProfileChanged(currentProfile.value, editForm.value)) {
    cancelEditing();
    return;
  }
  
  saving.value = true;
  error.value = null;
  
  try {
    const sanitizedData = sanitizeProfileData(editForm.value);
    const updatedProfile = await editProfile(currentProfile.value.id, sanitizedData);
    currentProfile.value = updatedProfile;
    isEditing.value = false;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
    console.error('Erreur saveProfile:', err);
  } finally {
    saving.value = false;
  }
};

// Obtenir les initiales pour l'avatar
const getInitials = (profile: Profile): string => {
  return `${profile.firstName.charAt(0)}${profile.name.charAt(0)}`.toUpperCase();
};

</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 24px;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading, .error, .no-profile {
  text-align: center;
  padding: 40px 20px;
}

.error {
  color: #dc3545;
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #0056b3;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 24px;
}

.profile-title {
  margin: 0 0 12px 0;
  color: #3498db;
  font-weight: 600;
  font-size: 16px;
}

.profile-description {
  margin: 0;
  color: #7f8c8d;
  line-height: 1.5;
}

.edit-btn {
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.edit-btn:hover {
  background: #218838;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-group input:disabled,
.form-group textarea:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.validation-errors {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 12px;
}

.validation-errors ul {
  margin: 0;
  padding-left: 20px;
  color: #721c24;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn,
.save-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover:not(:disabled) {
  background: #545b62;
}

.save-btn {
  background: #007bff;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #0056b3;
}

.cancel-btn:disabled,
.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
