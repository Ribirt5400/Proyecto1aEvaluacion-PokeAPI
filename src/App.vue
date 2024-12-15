<template>
  <div id="app" class="min-vh-100 bg-light">
    <header class="color-primario text-white py-3">
      <nav class="navbar navbar-expand-lg navbar-light container">
        <router-link to="/" class="navbar-brand mx-auto">
          <img src="./../public/img/logo_pokemon.png" alt="Pokémon Logo" class="img-fluid" style="max-width: 200px;">
        </router-link>
        <div class="navbar-nav ms-auto">
          <router-link to="/" class="nav-item nav-link">
            <button class="button">
              <span class="button-content">Inicio</span>
            </button>
          </router-link>
          
        </div>
      </nav>
    </header>

    <main class="container py-4">
      <router-view :key="$route.path"/> <!-- añado :key="$route.path" para que recargue la pagina cuando cambie la URL -->
    </main>

    <footer class="bg-dark text-white py-4 text-center">
      <p>&copy; 2024 Pokédex App</p>
    </footer>
  </div>
</template>

<script setup>
</script>

<style>
  @import "./assets/styles.scss";
</style>
