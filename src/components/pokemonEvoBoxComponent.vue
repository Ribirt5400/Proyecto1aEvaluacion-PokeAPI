<template>
    <div class="pokemon-box-item">
        <router-link :to="{ name: 'singlePokemonPage', params: { id: number } }">
            <div class="pokemon-box-img-container">
                <img :src="img" :alt="name" class="pokemon-img">
            </div>
            <span class="pokemon-name">{{ number + " " + name }}</span>
        </router-link>
        <p class="evolution-method">{{ method }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    img: String,
    name: String,
    number: Number,
    method: String
});
</script>

<style scoped>
@import "./../assets/pokemonEvoBoxComponent.scss"
</style>
