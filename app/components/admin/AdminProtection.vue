<script setup>
import { onMounted, ref } from 'vue'

const isAuthorized = ref(false)

onMounted(async () => {
  const token = sessionStorage.getItem('movieKingAdminToken')

  // Aucun jeton : retour à la connexion
  if (!token) {
    await navigateTo('/admin/login')
    return
  }

  try {
    // Le serveur vérifie le jeton et récupère l'utilisateur
    const response = await $fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // Seuls les administrateurs peuvent continuer
    if (response.user_role !== 'admin') {
      sessionStorage.removeItem('movieKingAdminToken')
      await navigateTo('/admin/login')
      return
    }

    isAuthorized.value = true
  } catch {
    // Jeton invalide ou expiré
    sessionStorage.removeItem('movieKingAdminToken')
    await navigateTo('/admin/login')
  }
})
</script>

<template>
  <slot v-if="isAuthorized" />
</template>
