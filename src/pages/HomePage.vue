<template>
  <div class="container mt-5">
    <div class="mb-4 ">
      <input 
        type="text" 
        v-model="searchQuery" 
        @input="filterPokemons" 
        class="form-control" 
        placeholder="Buscar por ID, Nombre o Tipo"
      />
    </div>
    
    <div v-if="loading" class="pokeball-container">
      <div class="pokeball"></div>
    </div>

    <div class="pokemon-container" v-if="!loading">
      <pokemonBoxComponent v-for="(pokemon, key) in filteredPokemons" 
      :key="pokemon.id" 
      :id="pokemon.id"
      :name="pokemon.name" 
      :number="pokemon.id" 
      :img="pokemon.img" 
      :types="pokemon.types" 
    />

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import pokemonBoxComponent from './../components/pokemonBoxComponent.vue';

const pokemonList = ref([]);
const filteredPokemons = ref([]);
const searchQuery = ref('');
const loading = ref(true);

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

const loadAllPokemons = async () => {
  try {
    const pokemonPromises = [];

    // ponemos el limite de IDs en 1025 porque son los pokemon que hay ahora, si esto no estuviera mostraria las otras formas de algunos pokemon, como Deoxys, o megaevoluciones
    // porque tienen IDs a partir del 10001
    for (let id = 1; id <= 1025; id++) {
      pokemonPromises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(response => response.json()));
    }

    const allPokemonsData = await Promise.all(pokemonPromises);

    const allPokemons = allPokemonsData.map(pokemonData => ({
      id: pokemonData.id,
      name: pokemonData.name,
      img: pokemonData.sprites.front_default,
      types: pokemonData.types.map(type => type.type.name), 
    }));

    pokemonList.value = allPokemons;
    filteredPokemons.value = allPokemons;
    loading.value = false;  // cuando carguen todos se pone en false
  } catch (error) {
    console.error("Error al cargar los Pokémon:", error);
    loading.value = false; 
  }
};

loadAllPokemons();

// establezco los filtros para que se pueda buscar por nombre ID o tipo (en ingles y en español)
const filterPokemons = () => {
  const query = searchQuery.value.toLowerCase();
  filteredPokemons.value = pokemonList.value.filter(pokemon => {
    return pokemon.name.toLowerCase().includes(query) ||
      pokemon.id.toString().includes(query) ||
      pokemon.types.some(type => {
        const englishType = type.toLowerCase();
        const spanishType = typeTranslation[englishType];
        return englishType.includes(query) || (spanishType && spanishType.includes(query));
      }); 
  });
};
</script>

<style scoped>
@import './../assets/HomePage.scss';
</style>