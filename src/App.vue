<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { usePanierStore } from './stores/panier'

const panier = usePanierStore()
</script>

<template>
  <header class="navbar">
    <RouterLink to="/" class="brand">VuShop</RouterLink>
    <nav>
      <RouterLink to="/">Boutique</RouterLink>
      <RouterLink to="/panier" class="panier-link">
        Panier
        <span v-if="panier.nombreArticles > 0" class="badge">{{ panier.nombreArticles }}</span>
      </RouterLink>
    </nav>
  </header>

  <main class="main">
    <RouterView />
  </main>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 56px;
  background: #1e293b;
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand {
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: none;
}

nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

nav a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 4px 10px;
  border-radius: 4px;
  transition: color 0.15s;
}

nav a:hover,
nav a.router-link-active {
  color: white;
}

.panier-link {
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge {
  background: #e74c3c;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 999px;
}

.main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
</style>
