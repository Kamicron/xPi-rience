import { env } from "process";

export interface Profile {
  id: string;
  name: string;
  firstName: string;
  description: string;
  title: string;
}

export interface CreateProfileDto {
  name: string;
  firstName: string;
  description: string;
  title: string;
}

export interface UpdateProfileDto {
  name?: string;
  firstName?: string;
  description?: string;
  title?: string;
}

export const useProfiles = () => {
  const config = useRuntimeConfig();
  const { getAuthHeaders } = useAuth();

  console.log('config', config)
  const baseURL = config.public.apiBaseUrl || 'http://localhost:5001';

  // Récupérer tous les profils
  const getAllProfiles = async (): Promise<Profile[]> => {
    const data = await $fetch<Profile[]>(`${baseURL}/profiles`);
    return data;
  };

  // Récupérer un profil par ID
  const getProfileById = async (id: string): Promise<Profile> => {
    const data = await $fetch<Profile>(`${baseURL}/profiles/${id}`);
    return data;
  };

  // Créer un nouveau profil (nécessite une authentification admin)
  const createProfile = async (profileData: CreateProfileDto): Promise<Profile> => {
    const authHeaders = getAuthHeaders();
    const data = await $fetch<Profile>(`${baseURL}/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: profileData,
    });
    return data;
  };

  // Mettre à jour un profil (nécessite une authentification admin)
  const updateProfile = async (id: string, profileData: UpdateProfileDto): Promise<Profile> => {
    const authHeaders = getAuthHeaders();

    console.log('authHeaders', authHeaders)

    const data = await $fetch<Profile>(`${baseURL}/profiles/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: profileData,
    });
    return data;
  };

  // Supprimer un profil (nécessite une authentification admin)
  const deleteProfile = async (id: string): Promise<void> => {
    const authHeaders = getAuthHeaders();
    await $fetch(`${baseURL}/profiles/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeaders,
      },
    });
  };

  return {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
  };
};
