<script setup lang="ts">
defineProps<{
  number: number
}>()

function getNumber(n: number): string {
  if (n === 1) return "⚀"
  if (n === 2) return "⚁"
  if (n === 3) return "⚂"
  if (n === 4) return "⚃"
  if (n === 5) return "⚄"
  return "⚅"
}
</script>

<template>
  <div class="playing-dice">
    <span class="playing-dice--number">{{ getNumber(number) }}</span>
  </div>
</template>

<style scoped>
.playing-dice {
  position: relative;
  color: #ccc;
  /* border-radius: 8px; */
  width: 64px;
  height: 64px;
  /* display: inline-block; */
  text-align: center;
}

.playing-dice--number {
  font-size: 3em;
  margin-top: -20px;
}
</style>
