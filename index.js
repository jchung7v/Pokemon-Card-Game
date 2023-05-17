const easyLevelCardNumber = 6;
const medLevelCardNumber = 12;
const hardLevelCardNumber = 20;

const firstCardName = "";
const secondCardName = "";

let pokemons = [];
let innerResponse = [];
const rand = [];

// data fetch
const start = async () => {
  const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100");
  pokemons = res.data.results;
  console.log(pokemons)

  const rand = getRandomInt(pokemons.length);

  // assign task to each button
  $('.easy-btn').on('click', async function (e) {
    displayCards(pokemons, 1);
  })
  $('.med-btn').on('click', async function (e) {
    displayCards(pokemons, 2);
  })
  $('.hard-btn').on('click', async function (e) {
    displayCards(pokemons, 3);
  })
  $('.reset-btn').on('click', async function (e) {
    $('.flip-card-container').empty();
  })



}

// random number generator
function getRandomInt(max = 100) {
    return Math.floor(Math.random() * max);
  }

// shuffle and display cards
async function displayCards(pokemons, level) {

    // select number of cards based on level
    let selectedLevel = 0;
    if (level == 1) {
        selectedLevel = easyLevelCardNumber;
    } else if (level == 2) {
        selectedLevel = medLevelCardNumber;
    } else if (level == 3) {
        selectedLevel = hardLevelCardNumber;
    };

    $('.flip-card-back').empty();
    let cards = [];
    for (let i = 0; i < (selectedLevel / 2); i++) {
        const rand = getRandomInt(pokemons.length);
        let res = await axios.get(`${pokemons[rand].url}`);
        let thisPokemon = res.data;
        console.log(thisPokemon);

        for(let j = 0; j < 2; j++){
            cards.push(`
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <img src="./public/pokeball.png" alt="Poketball" style="width: 100px; height: 100px"/>
                        </div>
                        <div class="flip-card-back">
                            <div class="PokemonCard" pokemon-id=${thisPokemon.id} pokemon-name=${thisPokemon.name}>
                            <img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}" style="width: 200px; height: 200px"/>
                            <h3 style="color: black">${thisPokemon.name}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
    }

    // Fisher-Yates (Knuth) Shuffle
    let currentIndex = cards.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Swap it with the current element.
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }

    // Append shuffled cards to the container
    for (let i = 0; i < cards.length; i++) {
        $('.flip-card-container').append(cards[i]);
    }
}


$(document).ready(start);