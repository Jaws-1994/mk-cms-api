
<template>
  <div class="default-layout">
    <header class="topbar">
      <NuxtLink to="/" class="brand">
    <img src="/logo.png" alt="Logo Movie King" class="brand-icon" />
      </NuxtLink>

      <span class="subtitle">CMS cinéma</span>
    </header>

    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.topbar {
  min-height: 64px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  background: #181E29;
  border-bottom: 1px solid #303847;
}

.brand {
  color: #FFFFFF;
  font-size: 20px;
  font-weight: bold;
  text-decoration: none;
}

.subtitle {
  color: #94A3B8;
  font-size: 14px;
}

.main-content {
  padding: 24px;
}
</style>
