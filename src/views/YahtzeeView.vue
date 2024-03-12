<script setup lang="ts">
import { ref } from "vue";
import PlayingDice from "../components/PlayingDice.vue";

interface Die {
  n: number
}

const defaultDices: Die[] = Array.from(Array(6), newDie);
const dices = ref(defaultDices);
const holds = ref(new Map());

function newDie() {
  return {
    n: Math.floor(Math.random() * 6) + 1,
  }
}

function rollDice(dices: Die[]): Die[] {
  return dices.map((die, idx) => {
    return holds.value.has(idx) ? die : newDie()
  })
}
</script>

<template>
  <h1>Yahtzee ⚀ ⚅</h1>
  <div class="board">
    <div v-for="(die, idx) in dices" v-bind:key="idx">
      <PlayingDice :number="die.n" />
      <button
        class="hold"
        @click="() => holds.has(idx)
          ? holds.delete(idx)
          : holds.set(idx, true)"
      >{{ holds.has(idx) ? "Unlock 🔒" : "Lock 🔓" }}</button>
    </div>
  </div>
  <button
    class="big"
    @click="() => dices = rollDice(dices)"
  >Roll</button>
</template>

<style scoped>
.board {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hold {
  display: block;
}

.big {
  width: 100px;
  height: 25px;
}
</style>
