export const useProfilesState = () => {
  const { getAllProfiles, getProfileById, createProfile, updateProfile, deleteProfile } = useProfiles();

  // État réactif pour les profils
  const profiles = ref<Profile[]>([]);
  const currentProfile = ref<Profile | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Charger tous les profils
  const fetchProfiles = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      return profiles.value = await getAllProfiles();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des profils';
      console.error('Erreur fetchProfiles:', err);
    } finally {
      loading.value = false;
    }
  };

  // Charger un profil spécifique
  const fetchProfile = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      return currentProfile.value = await getProfileById(id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement du profil';
      console.error('Erreur fetchProfile:', err);
    } finally {
      loading.value = false;
    }
  };

  // Ajouter un nouveau profil
  const addProfile = async (profileData: CreateProfileDto) => {
    loading.value = true;
    error.value = null;
    
    try {
      const newProfile = await createProfile(profileData);
      profiles.value.push(newProfile);
      return newProfile;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la création du profil';
      console.error('Erreur addProfile:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Modifier un profil existant
  const editProfile = async (id: string, profileData: UpdateProfileDto) => {
    loading.value = true;
    error.value = null;
    
    try {
      const updatedProfile = await updateProfile(id, profileData);
      
      // Mettre à jour dans la liste
      const index = profiles.value.findIndex(p => p.id === id);
      if (index !== -1) {
        profiles.value[index] = updatedProfile;
      }
      
      // Mettre à jour le profil courant si c'est le même
      if (currentProfile.value?.id === id) {
        currentProfile.value = updatedProfile;
      }
      
      return updatedProfile;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la modification du profil';
      console.error('Erreur editProfile:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Supprimer un profil
  const removeProfile = async (id: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      await deleteProfile(id);
      
      // Retirer de la liste
      profiles.value = profiles.value.filter(p => p.id !== id);
      
      // Réinitialiser le profil courant si c'est celui supprimé
      if (currentProfile.value?.id === id) {
        currentProfile.value = null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la suppression du profil';
      console.error('Erreur removeProfile:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Réinitialiser l'état
  const resetState = () => {
    profiles.value = [];
    currentProfile.value = null;
    error.value = null;
    loading.value = false;
  };

  // Computed pour des données dérivées
  const profilesCount = computed(() => profiles.value.length);
  const hasProfiles = computed(() => profiles.value.length > 0);

  return {
    // État
    profiles: readonly(profiles),
    currentProfile: readonly(currentProfile),
    loading: readonly(loading),
    error: readonly(error),
    
    // Actions
    fetchProfiles,
    fetchProfile,
    addProfile,
    editProfile,
    removeProfile,
    resetState,
    
    // Computed
    profilesCount,
    hasProfiles,
  };
};
