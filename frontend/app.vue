<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { EToast, ETextOverflow } from 'vue3-modern-toast'

const { $toast } = useNuxtApp()

// Configuration globale dans votre app.vue
$toast.configure({
  position: {
    top: 20,
    right: 20
    // Vous pouvez aussi utiliser bottom et left
  },
  styles: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '300px',
    maxHeight: '100px',
    textOverflow: ETextOverflow.ELLIPSIS,
    types: {
      [EToast.SUCCESS]: {
        backgroundColor: '#48BB78',
        color: '#ffffff',
        borderColor: '#2F855A'
      },
      [EToast.ERROR]: {
        backgroundColor: '#F56565',
        color: '#ffffff',
        borderColor: '#C53030'
      },
      [EToast.WARNING]: {
        backgroundColor: '#ED8936',
        color: '#ffffff',
        borderColor: '#C05621'
      },
      [EToast.INFO]: {
        backgroundColor: '#4299E1',
        color: '#ffffff',
        borderColor: '#2B6CB0'
      }
    }
  }
})
</script>