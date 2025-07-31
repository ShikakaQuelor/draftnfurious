<template>
  <div class="text-center mt-12 sm:mt-16">
    <div class="card p-8 sm:p-12 lg:p-16 max-w-4xl mx-auto ornate-border">
      <div class="mb-8 sm:mb-12">
        <span class="text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6 block">🔮</span>
        <h3 class="text-3xl sm:text-4xl lg:text-5xl font-black text-gradient-gold mb-4 sm:mb-6 parchment-text">The Gathering Begins</h3>
        <p class="text-amber-200 text-lg sm:text-xl lg:text-2xl parchment-text px-4">All preparations complete. The multiverse awaits your command!</p>
        <div class="mtg-separator mt-6 sm:mt-8"></div>
      </div>
      
      <button 
        @click="$emit('start-tournament')"
        :disabled="!canStartTournament"
        class="btn btn-success btn-large text-lg sm:text-2xl lg:text-3xl px-8 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 relative overflow-hidden w-full sm:w-auto"
        :class="{ 'animate-pulse': canStartTournament }"
      >
        <span class="relative z-10 flex items-center justify-center gap-2 sm:gap-4 parchment-text">
          <span>⚔️</span>
          <span class="text-center">IGNITE THE PLANESWALKER SPARK</span>
          <span>⚔️</span>
        </span>
      </button>
      
      <div v-if="!canStartTournament" class="mt-6 sm:mt-8 p-4 sm:p-6 glass-dark border-2 border-red-500/60 rounded-xl">
        <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-red-300 font-bold text-lg sm:text-xl parchment-text">
          <span class="text-xl sm:text-2xl">⚠️</span>
          <span class="text-center sm:text-left">{{ startTournamentError }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '../../../stores/tournament'

interface Props {
  players: Player[]
}

const props = defineProps<Props>()

defineEmits<{
  'start-tournament': []
}>()

const canStartTournament = computed(() => {
  return props.players.length >= 2 && props.players.every(p => p.name.trim().length > 0)
})

const startTournamentError = computed(() => {
  if (props.players.length < 2) {
    return 'Need at least 2 players to start tournament'
  }
  if (props.players.some(p => p.name.trim().length === 0)) {
    return 'All players must have names'
  }
  return ''
})
</script>