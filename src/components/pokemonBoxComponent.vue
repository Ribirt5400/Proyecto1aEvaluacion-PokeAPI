<template>
  <div :class="['pokemon-box-item', backgroundClass]">
    <router-link :to="{ name: 'singlePokemonPage', params: { id: number } }" class="pokemon-link">
      <div class="pokemon-box-img-container mb-3">
        <img :src="img" :alt="`Imagen de ${name}`" class="pokemon-image" />
      </div>
      <span :class="['pokemon-name', textColorClass]">{{ formatName(name) }}</span>
    </router-link>

    <span  :class="['pokemon-number', getTextColorForNumber()]">{{ formatNumber(number) }}</span>

    <div class="pokemon-types mt-2">
      <span 
        v-for="(type, index) in translatedTypes" 
        :key="index" 
        :class="['pokemon-type', type, 'type-style', getTextColor(type)]"
      >
        {{ type.charAt(0).toUpperCase() + type.slice(1) }} 
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  img: String,
  name: String,
  number: Number,
  types: Array,
});

// un color por cada tipo para el fondo del pokemon
const typeColors = {
  fire: '#f08030',
  water: '#6890f0',
  grass: '#78c850',
  electric: '#f8d030',
  psychic: '#f85888',
  bug: '#a8b820',
  normal: '#a8a878',
  rock: '#b8a038',
  ghost: '#705898',
  fairy: '#f8a0e0',
  poison: '#a040a0',
  fighting: '#c03028',
  ground: '#e0c068',
  steel: '#b8b8d0',
  ice: '#98d8d8',
  dragon: '#7038f8',
  dark: '#705848',
  flying: '#a890f0',
};

// traduccion de los tipos al español
const typeTranslation = {
  fire: 'fuego',
  water: 'agua',
  grass: 'planta',
  electric: 'eléctrico',
  psychic: 'psíquico',
  bug: 'bicho',
  normal: 'normal',
  rock: 'roca',
  ghost: 'fantasma',
  fairy: 'hada',
  poison: 'veneno',
  fighting: 'lucha',
  ground: 'tierra',
  steel: 'acero',
  ice: 'hielo',
  dragon: 'dragón',
  dark: 'siniestro',
  flying: 'volador',
};

// segun sea su primer tipo se establece su color de fondo
const backgroundClass = computed(() => {
  const firstType = props.types[0];
  return firstType ? `bg-${firstType}` : '';
});

const textColorClass = computed(() => {
  return props.types.includes('dark') ? 'text-white' : ''; 
});

const getTextColor = (type) => {
  return type === 'dark' ? 'text-white' : 'text-dark';
};

const getTextColorForNumber = () => {
  return props.types.includes('dark') ? 'text-white' : 'text-dark';
};

const formatName = (name) => {
  return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// los numeros salen con 4 digitos para que este cohesionado todo el codigo
const formatNumber = (number) => {
  return number.toString().padStart(4, '0'); 
};

const translatedTypes = computed(() => {
  return props.types.map(type => typeTranslation[type] || type); 
});
</script>

<style scoped>
@import './../assets/pokemonBoxComponent.scss';
</style>
