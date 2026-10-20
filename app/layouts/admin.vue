```vue
<script setup>
import { onMounted, ref } from 'vue'

const isAuthorized = ref(false)

onMounted(async () => {
  // Récupérer le jeton de connexion
  const token = sessionStorage.getItem('movieKingAdminToken')

  // Sans jeton, retour à la connexion
  if (!token) {
    await navigateTo('/admin/login', { replace: true })
    return
  }

  try {
    // Vérifier le jeton auprès du serveur
    const response = await $fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Vérifier le rôle de l'utilisateur
    if (response.user_role !== 'admin') {
      sessionStorage.removeItem('movieKingAdminToken')
      await navigateTo('/admin/login', { replace: true })
      return
    }

    // L'accès est autorisé
    isAuthorized.value = true
  } catch {
    // Jeton invalide, expiré ou requête refusée
    sessionStorage.removeItem('movieKingAdminToken')
    await navigateTo('/admin/login', { replace: true })
  }
})

// Déconnexion
const handleLogout = async () => {
  sessionStorage.removeItem('movieKingAdminToken')
  await navigateTo('/admin/login', { replace: true })
}
</script>

<template>
  <div v-if="isAuthorized" class="admin-layout">
    <!-- Navigation latérale -->
    <aside class="sidebar">
      <NuxtLink to="/admin" class="brand">
        <img src="/logo.png" alt="Logo Movie King" class="brand-icon" />
        <span class="brand-name">
          <strong>Movie King</strong>
          <small>ADMINISTRATION</small>
        </span>
      </NuxtLink>

      <div class="menu-label">MENU PRINCIPAL</div>

      <nav class="navigation">
        <NuxtLink to="/admin" class="nav-link">
          <span class="nav-icon">▦</span>
          Tableau de bord
        </NuxtLink>

        <NuxtLink to="/admin/categories" class="nav-link">
          <span class="nav-icon">▤</span>
          Catégories
        </NuxtLink>

        <NuxtLink to="/admin/joueurs" class="nav-link">
          <span class="nav-icon">♙</span>
          Utilisateurs
        </NuxtLink>
      </nav>

      <!-- Déconnexion en bas de la barre latérale -->
      <div class="sidebar-bottom">
        <div class="sidebar-separator"></div>

        <button
          class="nav-link logout-link"
          type="button"
          @click="handleLogout"
        >
          <span class="nav-icon">⇥</span>
          Déconnexion
        </button>
      </div>
    </aside>

    <!-- Zone principale -->
    <div class="admin-main">
      <header class="topbar">
        <div class="breadcrumb">
          <span class="breadcrumb-muted">MOVIE KING</span>
          <span class="breadcrumb-separator">/</span>
          <span>Administration</span>
        </div>

        <div class="admin-badge">
          <span class="status-dot"></span>
          ADMIN
        </div>
      </header>

      <main class="page-content">
        <slot />
      </main>

      <footer class="admin-footer">
        <span>MOVIE KING CMS</span>
        <span>ESPACE ADMINISTRATEUR</span>
      </footer>
    </div>
  </div>
</template>

<style>
/* ========================================
   COULEURS ET BASE
======================================== */

:root {
  --mk-background: #1D1D1D;
  --mk-sidebar: #171717;
  --mk-card: #2D2D2D;
  --mk-mint: #5E9E94;
  --mk-beige: #EADFC9;
  --mk-yellow: #FFB800;
  --mk-coral: #E85B65;
  --mk-white: #FFFFFF;
  --mk-muted: #A6A29A;
  --mk-border: #414141;
}

.admin-layout,
.admin-layout * {
  box-sizing: border-box;
}

.admin-layout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  background: var(--mk-background);
  color: var(--mk-beige);
  font-family: Inter, Arial, sans-serif;
}

/* ========================================
   BARRE LATÉRALE
======================================== */

.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: 250px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 26px 18px 20px;
  background: var(--mk-sidebar);
  border-right: 1px solid var(--mk-border);
  z-index: 100;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 8px 28px;
  margin-bottom: 24px;
  color: var(--mk-beige);
  text-decoration: none;
  border-bottom: 1px solid var(--mk-border);
}

.brand-icon {
  width: 42px;
  height: 42px;
  object-fit: contain;
  flex-shrink: 0;
}

.brand-name {
  min-width: 0;
}

.brand strong,
.brand small {
  display: block;
}

.brand strong {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.brand small {
  margin-top: 6px;
  color: var(--mk-mint);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2px;
}

.menu-label {
  margin: 0 10px 14px;
  color: var(--mk-muted);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.navigation {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Liens communs à toutes les pages */

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 13px 12px;
  border: 1px solid transparent;
  border-radius: 5px;
  color: #C8C4BB;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.nav-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  flex-shrink: 0;
  font-size: 19px;
}

/* Survol et page active */

.nav-link:hover {
  color: var(--mk-beige);
  background: #292929;
  border-color: #414141;
}

.nav-link.router-link-active {
  color: #111111;
  background: var(--mk-mint);
  border-color: var(--mk-mint);
  font-weight: 800;
}

/* Éviter que le tableau de bord reste actif sur les sous-pages */
.navigation a.router-link-exact-active[href="/admin"] {
  background: var(--mk-mint);
  color: #111111;
}

/* ========================================
   BAS DE LA BARRE LATÉRALE
======================================== */

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
  padding-top: 28px;
}

.sidebar-separator {
  height: 1px;
  margin-bottom: 6px;
  background: var(--mk-border);
}

.logout-link {
  color: #E5B8B8;
}

.logout-link:hover {
  color: var(--mk-white);
  background: #47272A;
  border-color: var(--mk-coral);
}

/* ========================================
   CONTENU PRINCIPAL
======================================== */

.admin-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  margin-left: 250px;
  background: var(--mk-background);
}

/* ========================================
   BARRE SUPÉRIEURE
======================================== */

.topbar {
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 32px;
  background: #242424;
  border-bottom: 1px solid var(--mk-border);
}

.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--mk-beige);
  font-size: 12px;
  font-weight: 600;
}

.breadcrumb-muted {
  color: var(--mk-muted);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.breadcrumb-separator {
  color: var(--mk-mint);
}

.admin-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 11px;
  background: #303D39;
  border: 1px solid #446C63;
  border-radius: 4px;
  color: var(--mk-mint);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.2px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--mk-mint);
}

/* ========================================
   ZONE DES PAGES
======================================== */

.page-content {
  flex: 1;
  min-width: 0;
  padding: 32px;
}

/* Titres principaux des pages */

.page-content h1 {
  color: var(--mk-beige);
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  letter-spacing: -0.8px;
}

.page-content h2,
.page-content h3 {
  color: var(--mk-beige);
}

/* Liens dans le contenu */

.page-content a:not(.nav-link) {
  color: var(--mk-mint);
}

/* Champs de formulaire communs */

.page-content input,
.page-content select,
.page-content textarea {
  max-width: 100%;
  background: var(--mk-beige);
  color: #1D1D1D;
  border: 1px solid #B8AD99;
  border-radius: 4px;
}

.page-content input:focus,
.page-content select:focus,
.page-content textarea:focus {
  outline: 2px solid var(--mk-mint);
  outline-offset: 2px;
}

/* ========================================
   BOUTONS JAUNES
======================================== */

.page-content button:not(.nav-link) {
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
}

.page-content button:not(.nav-link):hover {
  filter: brightness(1.05);
}

.page-content button:focus-visible,
.nav-link:focus-visible {
  outline: 2px solid var(--mk-yellow);
  outline-offset: 3px;
}

/*
  Pour les boutons d'action principaux,
  ajoute la classe "mk-button" dans leur template.
*/

.page-content .mk-button {
  padding: 11px 18px;
  background: var(--mk-yellow);
  color: #111111;
  border: 1px solid #111111;
  border-radius: 4px;
  box-shadow: 4px 4px 0 #000000;
  font-weight: 800;
  cursor: pointer;
}

.page-content .mk-button:hover {
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0 #000000;
}

.page-content .mk-button:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #000000;
}

/* ========================================
   CARTES ET TABLEAUX
======================================== */

/*
  Classes réutilisables pour les futurs blocs.
  Les styles restent limités au layout admin.
*/

.page-content .mk-card {
  padding: 22px;
  background: var(--mk-card);
  border: 1px solid var(--mk-border);
  border-left: 4px solid var(--mk-coral);
  border-radius: 5px;
}

.page-content .mk-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--mk-card);
  color: var(--mk-beige);
}

.page-content .mk-table th {
  padding: 14px;
  background: #242424;
  color: var(--mk-mint);
  font-size: 11px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.page-content .mk-table td {
  padding: 14px;
  border-top: 1px solid var(--mk-border);
}

.page-content .mk-table tr:hover td {
  background: #343434;
}

/* ========================================
   PIED DE PAGE
======================================== */

.admin-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 32px;
  border-top: 1px solid var(--mk-border);
  color: var(--mk-muted);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

/* ========================================
   RESPONSIVE
======================================== */

@media (max-width: 900px) {
  .sidebar {
    width: 210px;
    padding-right: 12px;
    padding-left: 12px;
  }

  .admin-main {
    margin-left: 210px;
  }

  .page-content {
    padding: 24px 20px;
  }

  .topbar {
    padding: 0 20px;
  }

  .admin-footer {
    padding: 16px 20px;
  }
}

@media (max-width: 600px) {
  .sidebar {
    width: 66px;
    padding: 18px 8px;
    align-items: center;
  }

  .brand {
    justify-content: center;
    padding: 8px 0 22px;
    margin-bottom: 20px;
  }

  .brand-icon {
    width: 38px;
    height: 38px;
  }

  .brand-name,
  .menu-label,
  .nav-link:not(.logout-link) {
    /* La règle suivante sera remplacée ci-dessous pour conserver les icônes. */
  }

  .navigation {
    width: 100%;
  }

  .navigation .nav-link {
    justify-content: center;
    gap: 0;
    padding: 13px 4px;
    font-size: 0;
  }

  .navigation .nav-icon {
    font-size: 19px;
  }

  .sidebar-bottom {
    width: 100%;
  }

  .logout-link {
    justify-content: center;
    gap: 0;
    padding: 13px 4px;
    font-size: 0;
  }

  .logout-link .nav-icon {
    font-size: 19px;
  }

  .admin-main {
    margin-left: 66px;
  }

  .topbar {
    min-height: 60px;
    padding: 0 12px;
  }

  .breadcrumb {
    gap: 6px;
    font-size: 10px;
  }

  .breadcrumb-muted {
    display: none;
  }

  .admin-badge {
    padding: 7px;
    font-size: 9px;
  }

  .page-content {
    padding: 22px 12px;
  }

  .admin-footer {
    flex-direction: column;
    padding: 14px 12px;
    font-size: 8px;
  }
}

/* Réduire les animations si l'utilisateur le préfère */

@media (prefers-reduced-motion: reduce) {
  .nav-link,
  .page-content button {
    transition: none;
  }
}
</style>
```