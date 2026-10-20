<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: false
})

// ========================================
// DONNÉES DU FORMULAIRE
// ========================================

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// ========================================
// CONNEXION ADMINISTRATEUR
// ========================================

const handleLogin = async () => {
  errorMessage.value = ''

  if (!email.value.trim() || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs.'
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        mail: email.value.trim(),
        password: password.value
      }
    })

    if (response.user?.role !== 'admin') {
      errorMessage.value =
        "Ce compte n'a pas accès à l'administration."
      return
    }

    // Stockage du token dans l'onglet courant.
    sessionStorage.setItem(
      'movieKingAdminToken',
      response.token
    )

    // Redirection vers le tableau de bord.
    await navigateTo('/admin')
  } catch (error) {
    errorMessage.value =
      error.data?.statusMessage ||
      'Connexion impossible. Vérifiez vos identifiants.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <!-- Décor d'arrière-plan -->



    <!-- Carte de connexion -->
    <section class="login-card">
      <!-- Identité Movie King -->
      <NuxtLink to="/" class="brand" aria-label="Movie King, retour à l'accueil">
      <img src="/logo.png" alt="Logo Movie King" class="brand-icon" />

        <span class="brand-name">
      
        </span>
      </NuxtLink>

      <!-- En-tête -->
      <div class="login-heading">
        <div class="secure-label">
          <span class="secure-dot"></span>
          ESPACE SÉCURISÉ
        </div>

        <h1>Administration</h1>

        <p>
          Connectez-vous pour gérer votre plateforme Movie King.
        </p>
      </div>

      <!-- Formulaire -->
      <form
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <div class="form-group">
          <label for="email">Adresse e-mail</label>

          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@exemple.com"
            autocomplete="username"
            :disabled="isLoading"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>

          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Votre mot de passe"
            autocomplete="current-password"
            :disabled="isLoading"
            required
          />
        </div>

        <!-- Message d'erreur -->
        <p
          v-if="errorMessage"
          class="error-message"
          role="alert"
          aria-live="polite"
        >
          <span class="error-icon">!</span>
          {{ errorMessage }}
        </p>

        <!-- Bouton de connexion -->
        <button
          type="submit"
          class="login-button"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading-spinner"></span>

          {{
            isLoading
              ? 'Connexion en cours...'
              : 'Se connecter'
          }}

          <span v-if="!isLoading" class="button-arrow">→</span>
        </button>
      </form>

    </section>


  </main>
</template>


<style scoped>
/* Fond général */
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #1D1D1D;
  color: #FFFFFF;
}

/* Bannière Movie King */
.login-header {
  width: 100%;
  max-width: 460px;
  padding: 22px 28px;
  background: #5E9E94;
  color: #EADFC9;
  border-bottom: 3px solid #EADFC9;
  box-sizing: border-box;
}

.login-header h1 {
  margin: 0;
  font-size: 25px;
  font-weight: 800;
  letter-spacing: 1px;
}

.login-header p {
  margin: 6px 0 0;
  color: #EADFC9;
  font-size: 12px;
  letter-spacing: 1.5px;
}

/* Carte du formulaire */
.login-card {
  width: 100%;
  max-width: 460px;
  padding: 32px 28px;
  background: #2D2D2D;
  border-left: 5px solid #E85B65;
  box-sizing: border-box;
  box-shadow: 8px 8px 0 #000000;
}

.login-card h2 {
  margin: 0 0 10px;
  color: #FFFFFF;
  font-size: 23px;
  font-weight: 700;
}

.login-description {
  margin: 0 0 26px;
  color: #C8C8C8;
  font-size: 14px;
  line-height: 1.6;
}

/* Champs et labels */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-bottom: 20px;
}

.form-group label {
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  min-height: 46px;
  padding: 12px 14px;
  border: 2px solid transparent;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  background: #EADFC9;
  color: #1D1D1D;
  font: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input::placeholder {
  color: #777064;
}

.form-group input:focus {
  border-color: #5E9E94;
  box-shadow: 0 0 0 3px rgb(94 158 148 / 20%);
}

/* Bouton principal */
.login-button {
  width: 100%;
  min-height: 48px;
  margin-top: 8px;
  padding: 13px 18px;
  border: none;
  border-radius: 4px;
  background: #FFB800;
  color: #000000;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.7px;
  cursor: pointer;
  box-shadow: 5px 5px 0 #000000;
  transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
}

.login-button:hover:not(:disabled) {
  background: #FFD04A;
  transform: translate(2px, 2px);
  box-shadow: 3px 3px 0 #000000;
}

.login-button:active:not(:disabled) {
  transform: translate(5px, 5px);
  box-shadow: none;
}

.login-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Message d'erreur */
.error-message {
  margin: 0 0 18px;
  padding: 12px 14px;
  border-left: 3px solid #E85B65;
  border-radius: 3px;
  background: rgb(232 91 101 / 12%);
  color: #FF9299;
  font-size: 13px;
  line-height: 1.5;
}

/* Texte sous le formulaire */
.login-footer {
  margin-top: 24px;
  color: #A9A9A9;
  font-size: 12px;
  text-align: center;
}

/* Indicateur de chargement */
.login-button:disabled {
  cursor: wait;
}

@media (max-width: 480px) {
  .login-page {
    padding: 18px;
  }

  .login-header {
    padding: 20px;
  }

  .login-card {
    padding: 26px 20px;
  }

  .login-header h1 {
    font-size: 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .form-group input,
  .login-button {
    transition: none;
  }
}
</style>
