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
    <div class="playing-card--suit" :class="[{ 'hidden': number < 2 }]">
      <span>{{ getSuit(suit) }}</span>
    </div>
    <div class="playing-card--number" :class="[suit]">
      <span>{{ getNumber(number) }}</span>
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
  width: 64px;
  height: 96px;
  display: inline-block;
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

.playing-card--number {
  position: absolute;
  top: -8px;
  left: 4px;
  font-size: 2em;
}

.playing-card--suit {
  position: absolute;
  right: 4px;
  font-size: x-large;
}

.playing-card--suit-large {
  position: absolute;
  bottom: -16px;
  left: 4px;
  font-size: 4em;
}

.hidden {
  display: none;
}
</style>
