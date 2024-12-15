<template>
  <div class="container single-pokemon-page">
    <div class="btn-back mb-4">
      <router-link to="/">
        <button class="custom-button">Atrás</button>
      </router-link>
    </div>

    <div class="pokemon-details">
      <h2 class="text-center">{{ capitalize(pokemonData.name) }}</h2>

      <div class="pokemon-generation mb-4">
        <strong>Generación: </strong>{{ formattedGeneration }}
      </div>

      <div class="pokemon-images d-flex justify-content-center mb-4">
        <div class="image-container">
          <img :src="currentImage.front" alt="Frontal de {{ pokemonData.name }}" class="img-fluid rounded" />
          <img :src="currentImage.back" alt="Espalda de {{ pokemonData.name }}" class="img-fluid rounded mt-2" />
        </div>
      </div>
      <div class="d-flex justify-content-center mb-4">
        <button @click="toggleShiny" class="custom-button">
          Ver {{ shiny ? 'Normal' : 'Shiny' }}
        </button>
      </div>

      <div class="pokemon-abilities mb-4">
        <h4>Habilidades</h4>
        <ul class="list-group">
          <li v-for="ability in pokemonData.abilities" :key="ability.ability.name" class="list-group-item">
            {{ ability.ability.name }}
          </li>
        </ul>
      </div>

      <div class="pokemon-stats mb-4">
        <h4>Estadísticas</h4>
        <Radar :data="chartData" :options="chartOptions" />
        <div class="d-flex justify-content-between align-items-center mt-3">
          <span class="ms-auto" style="min-width: 40px; text-align: right;"><strong>{{ totalStats }}</strong></span>
        </div>
      </div>

      <div class="pokemon-moves mb-4">
        <h4>Movimientos</h4>
        <ul class="list-group">
          <li v-for="move in pokemonData.moves" :key="move.move.name" class="list-group-item">
            {{ move?.data?.name }} (Power: {{ move?.data?.power }}, PP: {{ move?.data?.pp }})
          </li>
        </ul>
      </div>

      <div class="pokemon-line mb-4">
        <h2>Línea evolutiva</h2>
        <Splide
          :options="{ perPage: 3, breakpoints: { 768: { perPage: 1 }, 1024: { perPage: 2 } }, gap: '1rem', pagination: false }">
          <SplideSlide v-for="pokemonData in chainEvolution" :key="pokemonData.id">
            <pokemonEvoBoxComponent :img="pokemonData.img" :name="pokemonData.name" :number="pokemonData.id"
              :method="pokemonData.method" />
          </SplideSlide>
        </Splide>
      </div>
    </div>
  </div>
</template>

<script setup>
import pokemonEvoBoxComponent from '@/components/pokemonEvoBoxComponent.vue';
import { ref, computed, onMounted, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import { Radar } from 'vue-chartjs';
import '@splidejs/splide/dist/css/splide.min.css';



let pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/';
let chainEvolution = ref([]);
let route = useRoute();
let id = ref(route.params.id);
let pokemonData = ref({});
let generation = ref('');
let generationRegion = ref('');
let shiny = ref(false);
let currentImage = ref({ front: '', back: '' });
const evolutionUrl = "https://pokeapi.co/api/v2/evolution-chain/";

// primera letra mayuscula
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const generationMap = {
  'generation-i': 'Kanto',
  'generation-ii': 'Johto',
  'generation-iii': 'Hoenn',
  'generation-iv': 'Sinnoh',
  'generation-v': 'Unova (Teselia)',
  'generation-vi': 'Kalos',
  'generation-vii': 'Alola',
  'generation-viii': 'Galar',
  'generation-ix': 'Paldea'
};

const formattedGeneration = computed(() => {
  const romanToLatin = {
    'i': 1,
    'ii': 2,
    'iii': 3,
    'iv': 4,
    'v': 5,
    'vi': 6,
    'vii': 7,
    'viii': 8,
    'ix': 9
  };

  // cambiar numeros romanos a latinos
  const genRoman = generation.value.split('-')[1]?.toLowerCase();
  const genNumber = romanToLatin[genRoman] || 'Desconocida';

  const region = generationMap[generation.value] || '';
  return `${genNumber}ª Generación -> ${region}`;
});

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

// stats traducidas
const statsTranslations = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque Especial',
  'special-defense': 'Defensa Especial',
  speed: 'Velocidad',
};

const translatedStats = computed(() =>
  pokemonData.value.stats?.map((stat) => ({
    name: statsTranslations[stat.stat.name] || stat.stat.name,
    value: stat.base_stat,
  })) || []
);

// datos del chart
const chartData = computed(() => ({
  labels: translatedStats.value.map((stat) => stat.name),
  datasets: [
    {
      label: 'Estadísticas Base',
      data: translatedStats.value.map((stat) => stat.value),
      backgroundColor: 'rgba(225, 225, 0, 0.4)',
      borderColor: 'rgba(38, 118, 186, 1)',
      borderWidth: 1,
    },
  ],
}));

// opciones del chart
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
  },
  scales: {
    r: {
      suggestedMin: 0,
      suggestedMax: 255,
    },
  },
};

let getIdFromUrl = (url) => {
  let elements = url.split('/');
  return elements[elements.length - 2];
};

let getPokemonLine = (pokemonData) => {

  let pokemonLine = [];

  pokemonLine.push(pokemonData.species);

  if (pokemonData.evolves_to != []) {
    for (let i = 0; i < pokemonData.evolves_to.length; i++) {
      pokemonLine.push(...getPokemonLine(pokemonData.evolves_to[i]));
    }
  }

  return pokemonLine;
}

onMounted(async () => {
  let data = await fetch(pokemonUrl + route.params.id);
  data = await data.json();

  // info del pokemon (especie)
  fetch(data.species.url)
    .then((speciesData) => speciesData.json())
    .then((speciesData) => {
      generation.value = speciesData.generation.name;

      fetch(speciesData.evolution_chain.url)
        .then((evolutionData) => evolutionData.json())
        .then((evolutionData) => {
          // cadena evolutiva
          const pokemonLine = getPokemonLine(evolutionData.chain);
          chainEvolution.value = pokemonLine;
          // imgs de la cadena evolutiva

          let evolutionDetails = evolutionData.chain.evolves_to[0];
          let currentPokemon = 0;

          const evolutionsParsed = [];
          const speciesMap = new Map();

          // extraer los detalles de manera recursiva
          const extractDetails = (node) => {
            const speciesName = node.species.name;

            // Si hemos pasado por un pokemon (por su especie), marca que "depende del juego" porque los metodos de evolucion de algunos pokemon como Glaceon cambian segun la generacion o el juego en el que estes
            if (!speciesMap.has(speciesName)) {
              speciesMap.set(speciesName, {
                species: speciesName,
                details: []
              });
            }

            // metodos de evolucion (nivel minimo, amistad o usar un item, hay mas pero)
            node.evolution_details.forEach((detail) => {
              const formattedDetail = {
                min_level: detail.min_level || "N/A",
                min_happiness: detail.min_happiness || "N/A",
                trigger: detail.trigger.name,
                item: detail.item?.name || "N/A",
                gender: detail.gender !== null ? (detail.gender === 1 ? "Femenino" : "Masculino") : "N/A"
              };
              speciesMap.get(speciesName).details.push(formattedDetail);
            });

            node.evolves_to.forEach(extractDetails);
          };

          extractDetails(evolutionData.chain);

          for (const [_, value] of speciesMap) {
            if (value.details.length > 1) {
              value.details.push({ note: "Depende del juego" });
            }
            evolutionsParsed.push(value);
          }


          chainEvolution.value.forEach((value, key) => {
            let id = getIdFromUrl(value.url);
            fetch(pokemonUrl + id)
              .then(data => data.json())
              .then((data) => {
                chainEvolution.value[key].img = data.sprites.front_default;
                chainEvolution.value[key].id = id;
                evolutionDetails = evolutionsParsed[currentPokemon];

                if (evolutionDetails.details.length != 0) {

                  switch (evolutionDetails.details[0].trigger) {

                    case "level-up":

                      if (evolutionDetails.details[0].min_level == "N/A") {
                        if (evolutionDetails.details[0].min_happiness != "N/A") {
                          chainEvolution.value[key].method = "Subir de nivel por amistad (" + evolutionDetails.details[0].min_happiness + ")"
                        }
                        else {
                          chainEvolution.value[key].method = "Consultar en wikidex"
                        }
                      }
                      else {
                        chainEvolution.value[key].method = "Subir al nivel " + evolutionDetails.details[0].min_level
                      }
                      break;

                    case "use-item":
                      chainEvolution.value[key].method = "Utilizar " + evolutionDetails.details[0].item
                      break;

                    default:
                      chainEvolution.value[key].method = "Consultar en wikidex"
                      break;
                  }
                }
                currentPokemon = currentPokemon + 1;
                evolutionDetails = evolutionDetails.evolves_to[0];
              });
          });
        });
    });

  delete data.sprites.other;
  delete data.sprites.versions;
  pokemonData.value = data;

  pokemonData.value.moves.forEach(async (element, keyMove) => {
    let moveData = await fetch(element.move.url);
    moveData = await moveData.json();
    pokemonData.value.moves[keyMove].data = moveData;
  });

  currentImage.value.front = pokemonData.value.sprites.front_default;
  currentImage.value.back = pokemonData.value.sprites.back_default;
});

let toggleShiny = () => {
  shiny.value = !shiny.value;
  currentImage.value.front = shiny.value ? pokemonData.value.sprites.front_shiny : pokemonData.value.sprites.front_default;
  currentImage.value.back = shiny.value ? pokemonData.value.sprites.back_shiny : pokemonData.value.sprites.back_default;
};

</script>

<style scoped>
@import "../assets/SinglePokemonPage.scss";
</style>
