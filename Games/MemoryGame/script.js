const cardsArray = [
  './img/computer.png',
  './img/character.png',
  './img/hands.png',
  './img/controller.png',
  './img/computer.png',
  './img/character.png',
  './img/hands.png',
  './img/controller.png',
  './img/computer.png',
  './img/character.png',
  './img/hands.png',
  './img/controller.png',
  './img/computer.png',
  './img/character.png',
  './img/hands.png',
  './img/controller.png'
];

let flippedCards = [];
let matchedCards = [];

function shuffle(array) {
let currentIndex = array.length, temporaryValue, randomIndex;

while (currentIndex !== 0) {
  randomIndex = Math.floor(Math.random() * currentIndex);
  currentIndex -= 1;
  temporaryValue = array[currentIndex];
  array[currentIndex] = array[randomIndex];
  array[randomIndex] = temporaryValue;
}

return array;
}

function createCards() {
const memoryCards = document.getElementById('memory-cards');
shuffle(cardsArray).forEach(card => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.innerHTML = `<img src="${card}" alt="Card">`;
  cardElement.addEventListener('click', () => flipCard(cardElement));
  memoryCards.appendChild(cardElement);
});
}

function flipCard(card) {
if (flippedCards.length < 2 && !flippedCards.includes(card) && !matchedCards.includes(card)) {
  card.querySelector('img').style.display = 'block';
  card.classList.add('flipped');
  flippedCards.push(card);
  if (flippedCards.length === 2) {
    checkMatch();
  }
}
}

function resetGame() {
  document.getElementById('win-message').style.display = 'none';
  matchedCards = [];
  const memoryCards = document.getElementById('memory-cards');
  memoryCards.innerHTML = '';
  createCards();
}

function checkMatch() {
  const [firstCard, secondCard] = flippedCards;
  if (firstCard.innerHTML === secondCard.innerHTML) {
    matchedCards = matchedCards.concat(flippedCards);
    flippedCards = [];
    if (matchedCards.length === cardsArray.length) {
      setTimeout(() => {
        document.getElementById('win-message').style.display = 'flex';
      }, 500);
    }
  } else {
    setTimeout(() => {
      flippedCards.forEach(card => {
        card.querySelector('img').style.display = 'none';
        card.classList.remove('flipped');
      });
      flippedCards = [];
    }, 550);
  }
}

createCards();