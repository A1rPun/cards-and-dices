<script setup lang="ts">
import { ref } from "vue";
import PlayingCard from "@/components/Solitaire/PlayingCard.vue";
import { Card } from "@/components/Solitaire/Card";
import { Lane } from "@/components/Solitaire/Lane";
import { shuffleDeck } from "@/components/Solitaire/Solitaire";

const cards = ["hearts", "diamonds", "clubs", "spades"]
    .flatMap((suit) => Array.from(Array(13), (_, idx) => new Card(suit, idx + 2)));

const won = ref(false);
const menu = ref(false);
const score = ref({});
const moves = ref([]);
const clicks = ref(0);
const shaker = ref({});
const playingField = ref([]);
const stats = ref({
  wins: parseInt(localStorage.getItem("solitaireLifeTimeWins") ?? "0"),
  totalMoves: parseInt(localStorage.getItem("solitaireLifeTimeMoves") ?? "0"),
  totalClicks: parseInt(localStorage.getItem("solitaireLifeTimeClicks") ?? "0"),
})
const drawdeck = ref({
  deck: [],
  index: -1,
});

init();

function init() {
  shuffleDeck(cards);
  initScore();
  initPlayfield();
  initDrawdeck();
}

function initScore() {
  score.value = {
    "hearts": 0,
    "diamonds": 0,
    "clubs": 0,
    "spades": 0,
  };
}

function initPlayfield() {
  playingField.value = [];

  for (let i = 0, count = 0; i < 7; i++) {
    const lane = cards.slice(count, count + i + 1);
    playingField.value.push(new Lane(lane));
    count += i + 1;
  }
}

function initDrawdeck() {
  drawdeck.value.deck = cards.slice(-24);
  drawdeck.value.index = -1;
}

function canAddToScore(card: Card): boolean {
  if (card.n === 14) {
    score.value[card.suit] = 14;
    return true;
  } else if (card.n === 2 && score.value[card.suit] === 14) {
    score.value[card.suit] = 2;
    return true;
  } else if (card.n - 1 === score.value[card.suit]) {
    score.value[card.suit] = card.n;
    return true;
  }
  return false;
}

function canAddToLane(card: Card): Lane|undefined {
  if (card.n === 13) {
    const [emptyLane] = playingField.value.filter(lane => lane.isEmpty());

    if (emptyLane) {
      return emptyLane;
    }
  } else {
    const [lane] = playingField.value.filter(lane => lane.canAddCard(card))

    if (lane) {
      return lane;
    }
  }
}

function checkWinState(): void {
  if (playingField.value.every(field => !field.hidden.length)) {
    won.value = true;
    stats.value.wins = stats.value.wins + 1;
    localStorage.setItem("solitaireLifeTimeWins", stats.value.wins.toString());
  }
}

function didAMove() {
  stats.value.totalMoves = stats.value.totalMoves + 1;
  moves.value.push(1); // TODO: history
  localStorage.setItem("solitaireLifeTimeMoves", stats.value.totalMoves.toString());
}

function didAClick() {
  clicks.value = clicks.value + 1;
  stats.value.totalClicks = stats.value.totalClicks + 1;
  localStorage.setItem("solitaireLifeTimeClicks", stats.value.totalClicks.toString());
}

function shake(card: Card): void {
  shaker.value = card;
  setTimeout(() => shaker.value = {}, 100); // TODO: Fix bug by clearing timeout
}

function undo() {
  const lastMove = moves.value.pop();
  // lastMove
}

function newGame() {
  init();
  hideMenu();
}

function restart() {
  initScore();
  initPlayfield();
  initDrawdeck();
  hideMenu();
}

function showMenu() {
  menu.value = true;
}

function hideMenu() {
  menu.value = false;
}
</script>

<template>
  <div class="solitaire">
    <div class="solitaire--bar">
      <!-- <button @click="" title="Hint">?<br>Hint</button> -->
      <button @click="showMenu" title="Menu">🍔<br>Menu</button>
      <div>
        <div v-if="moves.length">{{ moves.length }} moves</div>
        <div v-if="clicks">{{ clicks }} card clicks</div>
      </div>
      <button @click="undo" title="Undo">↩<br>Undo</button>
    </div>
    <div class="solitaire--header">
      <div class="solitaire--goal">
        <div class="solitaire--wrap">
          <PlayingCard
            v-for="(n, suit) in score"
            v-bind:key="suit"
            :suit="suit"
            :number="n"
            :class="{ shake: shaker.n === n && shaker.suit === suit }"
            @click="() => {
              const card = new Card(suit, n);
              const lane = canAddToLane(card);

              if (lane) {
                lane.cards.push(card);

                if (n === 2) {
                  score[suit] = 14;
                } else {
                  score[suit]--;
                }
                didAMove();
                didAClick();
              } else if (n > 1) {
                shake(card);
                didAClick();
              }
            }"
          />
        </div>
      </div>
      <div class="solitaire--deck">
        <div class="solitaire--wrap">
          <PlayingCard
            :suit="drawdeck.index >= 0 ? drawdeck.deck[drawdeck.index].suit : 'hearts'"
            :number="drawdeck.index >= 0 ? drawdeck.deck[drawdeck.index].n : 0"
            :class="{ shake: drawdeck.index >= 0 && shaker.n === drawdeck.deck[drawdeck.index].n && shaker.suit === drawdeck.deck[drawdeck.index].suit }"
            @click="() => {
              if (drawdeck.index === -1) return

              if (canAddToScore(drawdeck.deck[drawdeck.index])) {
                drawdeck.deck.splice(drawdeck.index, 1);
                drawdeck.index--;
                didAMove();
                didAClick();
                return
              }

              const lane = canAddToLane(drawdeck.deck[drawdeck.index]);

              if (lane) {
                const card = drawdeck.deck.splice(drawdeck.index, 1);
                lane.cards.push(...card);
                drawdeck.index--;
                checkWinState();
                didAMove();
              } else {
                shake(drawdeck.deck[drawdeck.index]);
              }
              didAClick();
            }"
          />
          <PlayingCard
            :number="drawdeck.index === drawdeck.deck.length - 1 ? 0 : 1"
            @click="() => {
              drawdeck.index++;
              if (drawdeck.index >= drawdeck.deck.length) {
                drawdeck.index = -1;
              }
              didAClick();
            }"
          />
        </div>
      </div>
    </div>
    <div class="solitaire--playfield">
      <div
        v-for="(field, idx) in playingField"
        v-bind:key="idx"
        class="solitaire--playfield-lane"
      >
        <PlayingCard
          v-show="field.isEmpty()"
          :number="0"
        />
        <PlayingCard
          v-for="(_, idx2) in field.hidden"
          v-bind:key="idx2"
          :number="1"
        />
        <PlayingCard
          v-for="(card, idx2) in field.cards"
          v-bind:key="idx2"
          :suit="card.suit"
          :number="card.n"
          :class="{ shake: shaker.n === card.n && shaker.suit === card.suit }"
          @click="() => {
            const isLast = idx2 === field.cards.length - 1;

            if (isLast && canAddToScore(card)) {
              field.cards.pop();
              field.popHidden();
              didAMove();
              didAClick();
              return
            }

            const lane = canAddToLane(card);

            if (lane) {
              const cards = field.cards.splice(idx2);
              lane.cards.push(...cards);
              field.popHidden();
              checkWinState();
              didAMove();
            } else {
              shake(card);
            }
            didAClick();
          }"
        />
      </div>
    </div>
    <span class="won" v-if="won">YOU WON!</span>
  </div>
  <div
    class="solitaire--menu-background"
    v-if="menu"
    @click="hideMenu"
  ></div>
  <div class="solitaire--menu" v-if="menu">
    <div class="solitaire--menu-close"></div>
    <button @click="newGame">♥︎♦︎♣︎♠︎<br>New game</button>
    <button @click="restart">↺<br>Restart game</button>
    <button @click="hideMenu">×<br>Close menu</button>
    <div>{{ stats.wins }} lifetime wins</div>
    <div>{{ stats.totalMoves }} lifetime moves</div>
    <div>{{ stats.totalClicks }} lifetime card clicks</div>
  </div>
</template>

<style scoped>
.solitaire {
  display: flex;
  flex-direction: column;
  background: green;
  flex: 1;
  width: 600px;
  margin: 0 auto;
}

.solitaire--bar {
  display: flex;
  background: darkgreen;
  justify-content: space-between;
  padding: 4px;
  gap: 8px;
}

.solitaire--header {
  display: flex;
  justify-content: space-between;
}

.solitaire--goal {
  display: flex;
  gap: 4px;
}

.solitaire--wrap {
  display: flex;
  gap: 4px;
  padding: 4px;
}

.solitaire--deck {}

.solitaire--playfield {
  display: flex;
  justify-content: space-between;
  padding: 4px;
}

.solitaire--playfield-lane {
  display: flex;
  flex-direction: column;
  margin-top: 48px;
}

.solitaire--playfield-lane > * {
  margin-top: -48px;
}

.won {
  font-size: 3em;
  text-align: center;
}

.solitaire--menu-background {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 0 auto;
  background: rgba(204, 204, 204, 0.23);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4.9px);
  -webkit-backdrop-filter: blur(4.9px);
}

.solitaire--menu {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 8px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: darkgreen;
  border: 4px solid black;
  padding: 16px;
  width: 256px;
}

button {
  height: 50px;
  width: 100px;
  background-color: green;
  border: 1px solid black;
}

button:hover {
  background-color: darkgreen;
}

button:active {
  background-color: darkolivegreen;
}

.solitaire--menu button {
  width: auto;
}

@media (min-width: 1024px) {
  .solitaire {
    margin-bottom: 8px;
  }

  .solitaire--bar {
    padding: 16px;
    gap: 8px;
  }

  .solitaire--header {
  }

  .solitaire--goal {
    gap: 8px;
  }

  .solitaire--wrap {
    gap: 8px;
    padding: 16px;
  }

  .solitaire--deck {}

  .solitaire--playfield {
    padding: 16px;
  }

  .solitaire--playfield-lane {
  }

  .solitaire--playfield-lane > * {
    margin-top: -64px;
  }

  .won {
    font-size: 6em;
  }
}

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  0%,
  80% {
    transform: translate3d(-2px, 0, 0);
  }

  10%,
  70% {
    transform: translate3d(2px, 0, 0);
  }

  20%,
  40%,
  60% {
    transform: translate3d(-4px, 0, 0);
  }

  30%,
  50% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
