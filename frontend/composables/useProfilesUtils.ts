export const useProfilesUtils = () => {
  // Validation des données de profil
  const validateProfileData = (data: CreateProfileDto | UpdateProfileDto): string[] => {
    const errors: string[] = [];
    
    if ('name' in data && data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        errors.push('Le nom est requis');
      } else if (data.name.trim().length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères');
      }
    }
    
    if ('firstName' in data && data.firstName !== undefined) {
      if (!data.firstName || data.firstName.trim().length === 0) {
        errors.push('Le prénom est requis');
      } else if (data.firstName.trim().length < 2) {
        errors.push('Le prénom doit contenir au moins 2 caractères');
      }
    }
    
    if ('description' in data && data.description !== undefined) {
      if (!data.description || data.description.trim().length === 0) {
        errors.push('La description est requise');
      } else if (data.description.trim().length < 10) {
        errors.push('La description doit contenir au moins 10 caractères');
      }
    }
    
    if ('title' in data && data.title !== undefined) {
      if (!data.title || data.title.trim().length === 0) {
        errors.push('Le titre est requis');
      } else if (data.title.trim().length < 3) {
        errors.push('Le titre doit contenir au moins 3 caractères');
      }
    }
    
    return errors;
  };

  // Formater le nom complet
  const getFullName = (profile: Profile): string => {
    return `${profile.firstName} ${profile.name}`;
  };

  // Formater l'affichage du profil
  const formatProfileDisplay = (profile: Profile): string => {
    return `${getFullName(profile)} - ${profile.title}`;
  };

  // Rechercher dans les profils
  const searchProfiles = (profiles: Profile[], searchTerm: string): Profile[] => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return profiles;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    return profiles.filter(profile => 
      profile.name.toLowerCase().includes(term) ||
      profile.firstName.toLowerCase().includes(term) ||
      profile.title.toLowerCase().includes(term) ||
      profile.description.toLowerCase().includes(term)
    );
  };

  // Trier les profils
  const sortProfiles = (profiles: Profile[], sortBy: 'name' | 'firstName' | 'title' = 'name', order: 'asc' | 'desc' = 'asc'): Profile[] => {
    return [...profiles].sort((a, b) => {
      const aValue = a[sortBy].toLowerCase();
      const bValue = b[sortBy].toLowerCase();
      
      if (order === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  };

  // Nettoyer les données avant envoi
  const sanitizeProfileData = (data: CreateProfileDto | UpdateProfileDto): CreateProfileDto | UpdateProfileDto => {
    const sanitized = { ...data };
    
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key as keyof typeof sanitized] === 'string') {
        (sanitized as any)[key] = (sanitized as any)[key].trim();
      }
    });
    
    return sanitized;
  };

  // Générer un profil par défaut
  const createDefaultProfile = (): CreateProfileDto => {
    return {
      name: '',
      firstName: '',
      description: '',
      title: '',
    };
  };

  // Vérifier si un profil a été modifié
  const hasProfileChanged = (original: Profile, updated: UpdateProfileDto): boolean => {
    return (
      (updated.name !== undefined && updated.name !== original.name) ||
      (updated.firstName !== undefined && updated.firstName !== original.firstName) ||
      (updated.description !== undefined && updated.description !== original.description) ||
      (updated.title !== undefined && updated.title !== original.title)
    );
  };

  return {
    validateProfileData,
    getFullName,
    formatProfileDisplay,
    searchProfiles,
    sortProfiles,
    sanitizeProfileData,
    createDefaultProfile,
    hasProfileChanged,
  };
};
