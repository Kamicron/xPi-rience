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

  console.log('config', config)
  const baseURL = config.public.apiBaseUrl || 'http://localhost:3000';

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

  // Créer un nouveau profil
  const createProfile = async (profileData: CreateProfileDto): Promise<Profile> => {
    const data = await $fetch<Profile>(`${baseURL}/profiles`, {
      method: 'POST',
      body: profileData,
    });
    return data;
  };

  // Mettre à jour un profil
  const updateProfile = async (id: string, profileData: UpdateProfileDto): Promise<Profile> => {
    const data = await $fetch<Profile>(`${baseURL}/profiles/${id}`, {
      method: 'PATCH',
      body: profileData,
    });
    return data;
  };

  // Supprimer un profil
  const deleteProfile = async (id: string): Promise<void> => {
    await $fetch(`${baseURL}/profiles/${id}`, {
      method: 'DELETE',
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
