<script setup lang="ts">
import { ref } from "vue";
import PlayingCard from "@/components/Solitaire/PlayingCard.vue";
import { Card } from "@/components/Solitaire/Card";
import { Lane } from "@/components/Solitaire/Lane";

const cards = ["hearts", "diamonds", "clubs", "spades"]
  .flatMap((suit) => Array.from(Array(13), (_, idx) => new Card(suit, idx + 2)));
const drawIndex = ref(-1);
const wins = ref(parseInt(localStorage.getItem("solitaireLifeTimeWins") ?? "0"));
const totalMoves = ref(parseInt(localStorage.getItem("solitaireLifeTimeMoves") ?? "0"));
const totalClicks = ref(parseInt(localStorage.getItem("solitaireLifeTimeClicks") ?? "0"));
const won = ref(false);
const menu = ref(false);
const score = ref({
  "hearts": 0,
  "diamonds": 0,
  "clubs": 0,
  "spades": 0,
});
const moves = ref([]);
const shaker = ref({});

shuffleDeck(cards);

const playingField = ref([]);

for (let i = 0, count = 0; i < 7; i++) {
  const lane = cards.slice(count, count + i + 1);
  playingField.value.push(new Lane(lane));
  count += i + 1;
}

const drawDeck = cards.slice(-24);

function shuffleDeck(array: unknown[]): void {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
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
    wins.value = wins.value + 1;
  }
}

function saveStats() {
  localStorage.setItem("solitaireLifeTimeWins", wins.value.toString());
  localStorage.setItem("solitaireLifeTimeMoves", totalMoves.value.toString());
  localStorage.setItem("solitaireLifeTimeClicks", totalClicks.value.toString());
}

function didAMove() {
  totalMoves.value = totalMoves.value + 1;
  moves.value.push(1); // TODO: history
}

function didAClick() {
  totalClicks.value = totalClicks.value + 1;
  saveStats();
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
  window.location.reload(); // TODO: Re-init
}

function restart() {
}

function showMenu() {
  menu.value = true;
}
</script>

<template>
  <div class="solitaire">
    <div class="solitaire--bar">
      <!-- <button @click="" title="Hint">?<br>Hint</button> -->
      <button @click="showMenu" title="Menu">🍔<br>Menu</button>
      <div v-if="moves.length">{{ moves.length }} moves</div>
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
              } else {
                shake(card);
              }
              didAClick();
            }"
          />
        </div>
      </div>
      <div class="solitaire--deck">
        <div class="solitaire--wrap">
          <PlayingCard
            :suit="drawIndex >= 0 ? drawDeck[drawIndex].suit : 'hearts'"
            :number="drawIndex >= 0 ? drawDeck[drawIndex].n : 0"
            :class="{ shake: drawIndex >= 0 && shaker.n === drawDeck[drawIndex].n && shaker.suit === drawDeck[drawIndex].suit }"
            @click="() => {
              if (canAddToScore(drawDeck[drawIndex])) {
                drawDeck.splice(drawIndex, 1);
                drawIndex--;
                didAMove();
                didAClick();
                return
              }

              const lane = canAddToLane(drawDeck[drawIndex]);

              if (lane) {
                const card = drawDeck.splice(drawIndex, 1);
                lane.cards.push(...card);
                drawIndex--;
                checkWinState();
                didAMove();
              } else {
                shake(drawDeck[drawIndex]);
              }
              didAClick();
            }"
          />
          <PlayingCard
            :number="drawIndex === drawDeck.length - 1 ? 0 : 1"
            @click="() => {
              drawIndex++;
              if (drawIndex >= drawDeck.length) {
                drawIndex = -1;
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
    @click="() => menu = false"
  ></div>
  <div class="solitaire--menu" v-if="menu">
    <div class="solitaire--menu-close"></div>
    <button @click="newGame" title="New game">♥︎♦︎♣︎♠︎<br>New game</button>
    <!-- <button @click="restart" title="Restart">↺<br>Restart game</button> -->
    <button @click="() => menu = false" title="Restart">×<br>Close menu</button>
    <div>{{ wins }} lifetime wins</div>
    <div>{{ totalMoves }} lifetime moves</div>
    <div>{{ totalClicks }} lifetime card clicks</div>
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
