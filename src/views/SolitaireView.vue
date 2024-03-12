<script setup lang="ts">
import { ref } from "vue";
import PlayingCard from "../components/PlayingCard.vue";

class Card {
  suit: string
  n: number

  constructor(suit: string, n: number) {
    this.suit = suit;
    this.n = n;
  }

  isRed(): boolean {
    return this.suit === "hearts" || this.suit === "diamonds";
  }
}

class Lane {
  cards: Card[]
  hidden: Card[]

  constructor(cards: Card[]) {
    const first = cards.pop()
    this.hidden = cards;
    this.cards = [first!];
  }

  isEmpty(): boolean {
    return this.hidden.length === 0 && this.cards.length === 0;
  }

  canAddCard(card: Card): boolean {
    if (!this.cards.length) return false;

    const topCard = this.cards[this.cards.length - 1];

    return topCard.n - 1 === card.n && topCard.isRed() !== card.isRed()
  }

  popHidden(): void {
    if (this.cards.length === 0 && this.hidden.length) {
      this.cards.push(this.hidden.pop())
    }
  }
}

const cards = ["hearts", "diamonds", "clubs", "spades"]
  .flatMap((suit) => Array.from(Array(13), (_, idx) => new Card(suit, idx + 2)));
const drawIndex = ref(-1);
const score = ref({
  "hearts": 0,
  "diamonds": 0,
  "clubs": 0,
  "spades": 0,
});

shuffleDeck(cards)

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
</script>

<template>
  <div class="solitaire">
    <div class="solitaire--header">
      <div class="solitaire--goal">
        <div class="solitaire--wrap">
          <PlayingCard
            v-for="(n, suit) in score"
            v-bind:key="suit"
            :suit="suit"
            :number="n"
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
              }
            }"
          />
        </div>
      </div>
      <div class="solitaire--deck">
        <div class="solitaire--wrap">
          <PlayingCard
            :suit="drawIndex >= 0 ? drawDeck[drawIndex].suit : 'hearts'"
            :number="drawIndex >= 0 ? drawDeck[drawIndex].n : 0"
            @click="() => {
              if (canAddToScore(drawDeck[drawIndex])) {
                drawDeck.splice(drawIndex, 1);
                drawIndex--;
                return
              }

              const lane = canAddToLane(drawDeck[drawIndex]);

              if (lane) {
                const card = drawDeck.splice(drawIndex, 1);
                lane.cards.push(...card);
                drawIndex--;
              }
            }"
          />
          <PlayingCard
            :number="drawIndex === drawDeck.length - 1 ? 0 : 1"
            @click="() => {
              drawIndex++;
              if (drawIndex >= drawDeck.length)
                drawIndex = -1;
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
          @click="() => {
            const isLast = idx2 === field.cards.length - 1;

            if (isLast && canAddToScore(card)) {
              field.cards.pop();
              field.popHidden();
              return
            }

            const lane = canAddToLane(card);

            if (lane) {
              const cards = field.cards.splice(idx2);
              lane.cards.push(...cards);
              field.popHidden();
            }
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.solitaire {
  display: flex;
  flex-direction: column;
  background: green;
  margin-bottom: 8px;
  /* min-height: 100%; */
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

@media (min-width: 1024px) {
  .solitaire {
    margin-bottom: 8px;
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
  }
}
</style>
