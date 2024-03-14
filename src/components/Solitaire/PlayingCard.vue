<script setup lang="ts">
defineProps<{
  number: number
  suit?: string
}>()

function getNumber(n: number): string {
  if (n === 11) return "J" // B
  if (n === 12) return "Q" // V
  if (n === 13) return "K" // H
  if (n === 14) return "A"
  if (n < 2 || n > 14) return ""
  return n.toString()
}

function getSuit(suit?: string): string {
  if (suit === "spades") return "♠︎"
  if (suit === "clubs") return "♣︎"
  if (suit === "diamonds") return "♦︎"
  if (suit === "hearts") return "♥︎"
  return ""
}
</script>

<template>
  <div
    class="playing-card"
    :class="[suit, {
      'playing-card--back': number === 1,
      'playing-card--empty': number === 0,
    }]"
  >
    <div class="playing-card--top">
      <div class="playing-card--number" :class="[suit]">
        <span>{{ getNumber(number) }}</span>
      </div>
      <div class="playing-card--suit" :class="[{ 'hidden': number < 2 }]">
        <span>{{ getSuit(suit) }}</span>
      </div>
    </div>
    <div class="playing-card--suit-large" :class="[{ 'hidden': number < 2 }]">
      <span>{{ getSuit(suit) }}</span>
    </div>
  </div>
</template>

<style scoped>
.playing-card {
  position: relative;
  background: white;
  color: black;
  border-radius: 4px;
  width: 48px;
  height: 72px;
  display: flex;
  flex-direction: column;
  user-select: none;
  cursor: pointer;
  border: 1px solid black;
}

.playing-card--empty {
  background: darkgreen;
}

.playing-card--back {
  background: lightblue;
  background-image: linear-gradient(
      217deg,
      rgb(255 0 0 / 80%),
      rgb(255 0 0 / 0%) 70.71%
    ), linear-gradient(127deg, rgb(0 255 0 / 80%), rgb(0 255 0 / 0%) 70.71%),
    linear-gradient(336deg, rgb(0 0 255 / 80%), rgb(0 0 255 / 0%) 70.71%);
}

.hearts, .diamonds {
  color: red;
}

.playing-card--top {
  display: flex;
  justify-content: space-between;
  font-size: 1.3em;
  padding: 0 2px;
  margin-top: -4px;
}

.playing-card--number {
}

.playing-card--suit {
}

.playing-card--suit-large {
  font-size: 3em;
  text-align: center;
  flex: 1;
  margin-top: -16px;
}

.hidden {
  display: none;
}

@media (min-width: 1024px) {
  .playing-card {
    border-radius: 4px;
    width: 64px;
    height: 96px;
  }

  .playing-card--empty {
  }

  .playing-card--back {
  }

  .hearts, .diamonds {
  }

  .playing-card--top {
    font-size: 1.8em;
    padding: 0 4px;
    margin-top: -8px;
  }

  .playing-card--number {
  }

  .playing-card--suit {
  }

  .playing-card--suit-large {
    font-size: 4em;
    margin-top: -24px;
  }
}
</style>
