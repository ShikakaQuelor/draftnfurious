<template>
  <div class="text-center mb-8 sm:mb-12 card p-4 sm:p-10 bg-gradient-to-br from-amber-900/40 to-yellow-900/40 ornate-border">
    <h1 class="text-2xl sm:text-3xl lg:text-5xl font-black mb-4 sm:mb-6 parchment-text">
      <span class="text-xl sm:text-2xl lg:text-4xl">📜</span>
      <span class="text-gradient mx-2 sm:mx-3">Tournament Chronicle</span>
      <span class="text-xl sm:text-2xl lg:text-4xl">📜</span>
    </h1>
    <div class="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 lg:gap-8">
      <div class="glass-dark px-3 sm:px-4 py-2 rounded-lg border border-yellow-400/50">
        <span class="text-amber-200 font-semibold parchment-text text-sm sm:text-base">Format: </span>
        <span class="text-yellow-300 font-bold text-sm sm:text-base">{{ formatDisplayName }}</span>
      </div>
      <div class="glass-dark px-3 sm:px-4 py-2 rounded-lg border border-yellow-400/50">
        <span class="text-amber-200 font-semibold parchment-text text-sm sm:text-base">Round: </span>
        <span class="text-yellow-300 font-bold text-sm sm:text-base">{{ currentRound }} / {{ totalRounds }}</span>
      </div>
      <div v-if="tournamentComplete" class="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-700 to-green-600 text-green-100 rounded-lg font-bold border border-green-500/50 parchment-text text-sm sm:text-base">
        🏆 Chronicle Complete
      </div>
      <div v-else class="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-700 to-yellow-600 text-yellow-100 rounded-lg font-bold border border-yellow-500/50 parchment-text text-sm sm:text-base">
        ⚔️ Battle Rages On
      </div>
    </div>
    <div class="mtg-separator mt-4 sm:mt-6"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  format: string
  currentRound: number
  totalRounds: number
  tournamentComplete: boolean
}

const props = defineProps<Props>()

const formatDisplayName = computed(() => {
  const formatNames = {
    'round-robin': 'Round Robin',
    'swiss': 'Swiss',
    'single-elimination': 'Single Elimination'
  }
  return formatNames[props.format as keyof typeof formatNames] || props.format
})
</script>