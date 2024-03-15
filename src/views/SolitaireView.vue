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
const settings = ref({
  hints: !!localStorage.getItem("solitaireSettingsHints"),
});
const moves = ref([]);
const clicks = ref(0);
const shaker = ref({});
let shakeTimeout: number;
const stats = ref({
  wins: parseInt(localStorage.getItem("solitaireLifeTimeWins") ?? "0"),
  totalMoves: parseInt(localStorage.getItem("solitaireLifeTimeMoves") ?? "0"),
  totalClicks: parseInt(localStorage.getItem("solitaireLifeTimeClicks") ?? "0"),
})
const solitaire = ref({
  drawdeck: [],
  drawindex: -1,
  playField: [],
  score: {},
});

// const cardAnim = ref({
//   from: {},
//   to: {},
// })

let initState = {};

init();

function init(shuffle = true) {
  won.value = false;
  clicks.value = 0;
  moves.value = [];
  shuffle && shuffleDeck(cards);
  initScore();
  initPlayfield();
  initDrawdeck();
  initState = {
    drawindex: solitaire.value.drawindex,
    drawdeck: [...solitaire.value.drawdeck],
    playField: copyPlayField(solitaire.value.playField),
    score: {...solitaire.value.score},
  };
}

function copyPlayField(playField) {
  return playField.map(field => new Lane([...field.hidden], [...field.cards]));
}

function initScore() {
  solitaire.value.score = {
    "hearts": 0,
    "diamonds": 0,
    "clubs": 0,
    "spades": 0,
  };
}

function initPlayfield() {
  solitaire.value.playField = [];

  for (let i = 0, count = 0; i < 7; i++) {
    const lane = cards.slice(count, count + i + 1);
    const first = lane.pop()
    solitaire.value.playField.push(new Lane(lane, [first!]));
    count += i + 1;
  }
}

function initDrawdeck() {
  solitaire.value.drawdeck = cards.slice(-24);
  solitaire.value.drawindex = -1;
}

function canAddToScore(card: Card): boolean {
  return card.n === 14
    || card.n === 2 && solitaire.value.score[card.suit] === 14
    || card.n - 1 === solitaire.value.score[card.suit];
}

function addToScore(card: Card): void {
  solitaire.value.score[card.suit] = card.n;
}

function canAddToLane(card: Card): Lane|undefined {
  if (card.n === 13) {
    const [emptyLane] = solitaire.value.playField.filter(lane => lane.isEmpty());

    if (emptyLane) {
      return emptyLane;
    }
  } else {
    const [lane] = solitaire.value.playField.filter(lane => lane.canAddCard(card))

    if (lane) {
      return lane;
    }
  }
}

function checkWinState(): void {
  if (!won.value && solitaire.value.playField.every(field => !field.hidden.length)) {
    won.value = true;
    stats.value.wins = stats.value.wins + 1;
    localStorage.setItem("solitaireLifeTimeWins", stats.value.wins.toString());
  }
}

function didAMove() {
  stats.value.totalMoves = stats.value.totalMoves + 1;
  moves.value.push({
    drawindex: solitaire.value.drawindex,
    drawdeck: [...solitaire.value.drawdeck],
    playField: copyPlayField(solitaire.value.playField),
    score: {...solitaire.value.score},
  });
  localStorage.setItem("solitaireLifeTimeMoves", stats.value.totalMoves.toString());
}

function didAClick() {
  clicks.value = clicks.value + 1;
  stats.value.totalClicks = stats.value.totalClicks + 1;
  localStorage.setItem("solitaireLifeTimeClicks", stats.value.totalClicks.toString());
}

function shake(card: Card): void {
  shaker.value = card;
  clearTimeout(shakeTimeout);
  shakeTimeout = setTimeout(() => shaker.value = {}, 100);
}

function undo() {
  moves.value.pop();
  const lastMove = moves.value.length ? moves.value[moves.value.length - 1] : initState;
  solitaire.value = {
    drawindex: lastMove.drawindex,
    drawdeck: [...lastMove.drawdeck],
    playField: copyPlayField(lastMove.playField),
    score: {...lastMove.score},
  };
}

function newGame() {
  init();
  hideMenu();
}

function restart() {
  init(false);
  hideMenu();
}

function showMenu() {
  menu.value = true;
}

function hideMenu() {
  menu.value = false;
}

function setHint(enabled: boolean) {
  if (enabled) {
    localStorage.setItem('solitaireSettingsHints', '1');
  } else {
    localStorage.removeItem('solitaireSettingsHints');
  }
}

// function setCardAnim(card: Card, rect): void {
//   cardAnim.value.from = {
//     top: rect.top,
//     right: rect.right,
//     bottom: rect.bottom,
//     left: rect.left,
//     ...card,
//   };
//   console.log(cardAnim);
// }
</script>

<template>
  <div class="solitaire">
    <div class="solitaire--bar">
      <!-- <button @click="" title="Hint">?<br>Hint</button> -->
      <button @click="showMenu">🍔<br>Menu</button>
      <div>
        <div v-if="moves.length">{{ moves.length }} moves</div>
        <div v-if="clicks">{{ clicks }} card clicks</div>
      </div>
      <button :disabled="!moves.length" @click="undo">↩<br>Undo</button>
    </div>
    <div class="solitaire--header">
      <div class="solitaire--goal">
        <div class="solitaire--wrap">
          <PlayingCard
            v-for="(n, suit) in solitaire.score"
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
                  solitaire.score[suit] = 14;
                } else {
                  solitaire.score[suit]--;
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
            :suit="solitaire.drawindex >= 0 ? solitaire.drawdeck[solitaire.drawindex].suit : 'hearts'"
            :number="solitaire.drawindex >= 0 ? solitaire.drawdeck[solitaire.drawindex].n : 0"
            :class="{
              shake: solitaire.drawindex >= 0
                && shaker.n === solitaire.drawdeck[solitaire.drawindex].n
                && shaker.suit === solitaire.drawdeck[solitaire.drawindex].suit,
              hinter: settings.hints
                && solitaire.drawindex >= 0
                && (canAddToScore(solitaire.drawdeck[solitaire.drawindex])
                || canAddToLane(solitaire.drawdeck[solitaire.drawindex])),
            }"
            @click="event => {
              if (solitaire.drawindex === -1) return

              if (canAddToScore(solitaire.drawdeck[solitaire.drawindex])) {
                addToScore(solitaire.drawdeck[solitaire.drawindex]);
                // setCardAnim(solitaire.drawdeck[solitaire.drawindex], event.target.getBoundingClientRect());
                solitaire.drawdeck.splice(solitaire.drawindex, 1);
                solitaire.drawindex--;
                didAMove();
                didAClick();
                return
              }

              const lane = canAddToLane(solitaire.drawdeck[solitaire.drawindex]);

              if (lane) {
                const card = solitaire.drawdeck.splice(solitaire.drawindex, 1);
                lane.cards.push(...card);
                solitaire.drawindex--;
                checkWinState();
                didAMove();
                // setCardAnim(card[0], event.target.getBoundingClientRect());
              } else {
                shake(solitaire.drawdeck[solitaire.drawindex]);
              }
              didAClick();
            }"
          />
          <PlayingCard
            :number="solitaire.drawindex === solitaire.drawdeck.length - 1 ? 0 : 1"
            @click="() => {
              solitaire.drawindex++;
              if (solitaire.drawindex >= solitaire.drawdeck.length) {
                solitaire.drawindex = -1;
              }
              didAMove();
              didAClick();
            }"
          />
        </div>
      </div>
    </div>
    <div class="solitaire--playfield">
      <div
        v-for="(field, idx) in solitaire.playField"
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
          :class="{
            shake: shaker.n === card.n && shaker.suit === card.suit,
            hinter: settings.hints
              && ((idx2 === field.cards.length - 1
              && canAddToScore(card))
              || canAddToLane(card)),
          }"
          @click="event => {
            const isLast = idx2 === field.cards.length - 1;

            if (isLast && canAddToScore(card)) {
              const card = field.cards.pop();
              addToScore(card);
              field.popHidden();
              checkWinState();
              didAMove();
              didAClick();
              // setCardAnim(card, event.target.getBoundingClientRect());
              return
            }

            const lane = canAddToLane(card);

            if (lane) {
              const cards = field.cards.splice(idx2);
              lane.cards.push(...cards);
              field.popHidden();
              checkWinState();
              didAMove();
              // setCardAnim(card, event.target.getBoundingClientRect());
            } else {
              shake(card);
            }
            didAClick();
          }"
        />
      </div>
    </div>
    <div class="won" v-if="won">
      <span>YOU WON!</span>
      <!-- <button>Auto complete</button> -->
    </div>
    <!-- <PlayingCard
      v-if="cardAnim.from.n"
      :suit="cardAnim.from.suit"
      :number="cardAnim.from.n"
      class="cardanim"
      :style="{
        top: `${cardAnim.from.top}px`,
        right: `${cardAnim.from.right}px`,
        bottom: `${cardAnim.from.bottom}px`,
        left: `${cardAnim.from.left}px`,
      }"
    /> -->
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
    <label>
      <input
        type="checkbox"
        :checked="settings.hints"
        @change="event => {
          settings.hints = event.target.checked;
          setHint(settings.hints);
        }"
      />
      Hints
    </label>
    <div>{{ stats.wins }} lifetime wins</div>
    <div>{{ stats.totalMoves }} lifetime moves</div>
    <div>{{ stats.totalClicks }} lifetime card clicks</div>
  </div>
</template>

<style scoped>
.cardanim {
  position: absolute;
  animation: ease 1s;
}

.solitaire {
  display: flex;
  flex-direction: column;
  background: green;
  flex: 1;
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

button:disabled {
  background-color: gray;
  color: black;
  opacity: 0.5;
  cursor: not-allowed;
}

.solitaire--menu button {
  width: auto;
}

.hinter {
  box-shadow: 0 0 0 4px yellow;
}

@media (min-width: 1024px) {
  .solitaire {
    width: 600px;
    margin: 0 auto;
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
