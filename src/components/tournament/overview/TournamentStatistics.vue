<template>
  <div class="mb-8 sm:mb-12">
    <div class="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
      <span class="text-2xl sm:text-4xl">📊</span>
      <h2 class="text-xl sm:text-2xl lg:text-4xl font-bold text-gradient-gold parchment-text">Tournament Codex</h2>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
      <div class="card p-2 sm:p-3 lg:p-4 text-center border-t-4 border-yellow-500">
        <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gradient-gold mb-1 sm:mb-2">{{ playersCount }}</div>
        <div class="text-amber-300 font-semibold uppercase text-xs sm:text-sm tracking-wide parchment-text">Planeswalkers</div>
      </div>
      
      <div class="card p-2 sm:p-3 lg:p-4 text-center border-t-4 border-yellow-500">
        <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gradient-gold mb-1 sm:mb-2">{{ totalGames }}</div>
        <div class="text-amber-300 font-semibold uppercase text-xs sm:text-sm tracking-wide parchment-text">Total Battles</div>
      </div>
      
      <div class="card p-2 sm:p-3 lg:p-4 text-center border-t-4 border-yellow-500">
        <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gradient-gold mb-1 sm:mb-2">{{ completedGames }}</div>
        <div class="text-amber-300 font-semibold uppercase text-xs sm:text-sm tracking-wide parchment-text">Completed</div>
      </div>
      
      <div class="card p-2 sm:p-3 lg:p-4 text-center border-t-4 border-yellow-500">
        <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gradient-gold mb-1 sm:mb-2">{{ Math.round(completionPercentage) }}%</div>
        <div class="text-amber-300 font-semibold uppercase text-xs sm:text-sm tracking-wide parchment-text">Progress</div>
      </div>
      
      <div class="card p-2 sm:p-3 lg:p-4 text-center border-t-4 border-yellow-500" v-if="roundTimerMinutes">
        <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gradient-gold mb-1 sm:mb-2">{{ roundTimerMinutes }}m</div>
        <div class="text-amber-300 font-semibold uppercase text-xs sm:text-sm tracking-wide parchment-text">Round Timer</div>
      </div>
      
      <div class="card p-2 sm:p-3 lg:p-4 text-center border-t-4 border-yellow-500">
        <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gradient-gold mb-1 sm:mb-2">{{ pointsPerWin }}-{{ pointsPerDraw }}-{{ pointsPerLoss }}</div>
        <div class="text-amber-300 font-semibold uppercase text-xs sm:text-sm tracking-wide parchment-text">Scoring (W-D-L)</div>
      </div>
    </div>

    <!-- New Tournament Section -->
    <div class="text-center p-8 glass-dark rounded-lg border border-red-400/50 mt-8" v-if="tournamentComplete">
      <div class="mb-6">
        <span class="text-4xl mb-4 block">🔄</span>
        <h3 class="text-2xl font-bold text-amber-200 mb-2 parchment-text">Begin New Chronicle</h3>
        <p class="text-amber-400 parchment-text">Start a fresh tournament with new challengers</p>
      </div>
      <button 
        @click="$emit('reset-tournament')"
        class="btn btn-danger px-8 py-4 text-lg"
      >
        🗡️ Reset Tournament
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Game } from '../../../stores/tournament'

interface Props {
  games: Game[]
  playersCount: number
  roundTimerMinutes?: number
  pointsPerWin: number
  pointsPerDraw: number
  pointsPerLoss: number
  tournamentComplete: boolean
}

const props = defineProps<Props>()

defineEmits<{
  'reset-tournament': []
}>()

const totalGames = computed(() => props.games.length)

const completedGames = computed(() => {
  return props.games.filter(game => game.winner !== undefined).length
})

const completionPercentage = computed(() => {
  if (totalGames.value === 0) return 0
  return (completedGames.value / totalGames.value) * 100
})
</script>