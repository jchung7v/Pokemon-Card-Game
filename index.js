const easyLevelCardNumber = 6;
const medLevelCardNumber = 12;
const hardLevelCardNumber = 20;
let matchCounter = 0;
let clickCounter = 0;
let totalPairs = 0;
let pairsLeft = 0;
let selectedLevel = 0;

let selectedCardArray = [];
// let matchCardCollection = {};

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

  // play game
  $('body').on('click', '.flip-card', async function (e) {
    clickCounter ++;
    console.log(clickCounter)
    if ($(this).find('.flip-card-inner').hasClass('matched')) {
        return;
    }

    $(this).find('.flip-card-inner').addClass('flipped')
    let cardId = $(this).find('.pokemonCard').attr('pokemon-id');
    selectedCardArray.push({ id:cardId, element:this });

    if (selectedCardArray.length == 2) {
        if (selectedCardArray[0].id === selectedCardArray[1].id) {
            $(selectedCardArray[0].element).find('.flip-card-inner').addClass('matched');
            $(selectedCardArray[1].element).find('.flip-card-inner').addClass('matched');
            console.log("Match!")
            selectedCardArray = [];
            matchCounter ++;
            pairsLeft = totalPairs - matchCounter;
            console.log(matchCounter);
        } else {
            setTimeout(() => {
                $('.flip-card-inner').not('.matched').removeClass('flipped');
                selectedCardArray = [];
            }, 1000);
        }
    }

    $('#matches').text(matchCounter)
    $('#clicks').text(clickCounter)
    $('#pairs-left').text(pairsLeft)
  });

}


$('.reset-btn').on('click', async function (e) {
    $('.flip-card-container').empty();
    $('.flip-card-inner').removeClass('matched');
    $('.stat').empty();
})

// random number generator
function getRandomInt(max = 100) {
    return Math.floor(Math.random() * max);
  }

// shuffle and display cards
async function displayCards(pokemons, level) {

    // select number of cards based on level

    if (level == 1) {
        selectedLevel = easyLevelCardNumber;
        totalPairs = easyLevelCardNumber / 2;
    } else if (level == 2) {
        selectedLevel = medLevelCardNumber;
        totalPairs = medLevelCardNumber / 2;
    } else if (level == 3) {
        selectedLevel = hardLevelCardNumber;
        totalPairs = hardLevelCardNumber / 2;
    };

    $('#total-pairs').text(totalPairs);

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
                            <div class="pokemonCard" pokemon-id=${thisPokemon.id} pokemon-name=${thisPokemon.name}>
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