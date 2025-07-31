<template>
  <div class="mb-8 sm:mb-12">
    <div class="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
      <span class="text-2xl sm:text-4xl">⚔️</span>
      <h2 class="text-xl sm:text-2xl lg:text-4xl font-bold text-gradient-gold parchment-text">Battle Chronicles</h2>
    </div>
    
    <!-- Round Filter Buttons -->
    <div class="flex gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
      <button 
        v-for="round in Array.from({length: totalRounds}, (_, i) => i + 1)"
        :key="round"
        @click="$emit('update:selectedRound', round)"
        :class="{ 'border-yellow-500 bg-yellow-600/30': selectedRound === round }"
        class="btn btn-secondary px-2 sm:px-4 py-1 sm:py-2 border-2 border-yellow-600/60 text-amber-100 transition-all hover:border-yellow-500 hover:bg-yellow-600/20 text-xs sm:text-sm"
      >
        Round {{ round }}
      </button>
      <button 
        @click="$emit('update:selectedRound', null)"
        :class="{ 'border-yellow-500 bg-yellow-600/30': selectedRound === null }"
        class="btn btn-secondary px-2 sm:px-4 py-1 sm:py-2 border-2 border-yellow-600/60 text-amber-100 transition-all hover:border-yellow-500 hover:bg-yellow-600/20 text-xs sm:text-sm"
      >
        All Rounds
      </button>
    </div>

    <div class="space-y-3">
      <div 
        v-for="game in filteredGames" 
        :key="game.id"
        class="p-3 sm:p-4 lg:p-6 card transition-all hover:border-yellow-300/50"
        :class="{ 
          'border-l-4 border-green-500': game.winner,
          'border-l-4 border-yellow-500 bg-amber-900/20': game.round === currentRound && !tournamentComplete
        }"
      >
        <!-- Mobile Layout -->
        <div class="md:hidden">
          <div class="flex justify-between items-center mb-2">
            <div class="text-amber-300 font-semibold parchment-text text-sm">Round {{ game.round }}</div>
            <div class="text-right font-semibold text-sm">
              <span v-if="!game.winner" class="text-amber-400 italic parchment-text">Awaiting Battle</span>
              <span v-else-if="game.winner === 'draw'" class="text-yellow-400 parchment-text">🤝 Draw</span>
              <span v-else class="text-green-400 parchment-text">🏆 {{ getPlayerName(game.winner) }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 justify-center text-sm">
            <span class="font-semibold text-amber-100 parchment-text" :class="{ 'text-green-400 font-bold': game.winner === game.player1Id }">
              {{ getPlayerName(game.player1Id) }}
            </span>
            <span class="text-amber-400">⚔️</span>
            <span class="font-semibold text-amber-100 parchment-text" :class="{ 'text-green-400 font-bold': game.winner === game.player2Id }">
              {{ getPlayerName(game.player2Id) }}
            </span>
          </div>
        </div>
        
        <!-- Desktop Layout -->
        <div class="hidden md:grid grid-cols-3 items-center">
          <div class="text-amber-300 font-semibold parchment-text">Round {{ game.round }}</div>
          <div class="flex items-center gap-4 justify-center">
            <span class="font-semibold text-amber-100 parchment-text" :class="{ 'text-green-400 font-bold': game.winner === game.player1Id }">
              {{ getPlayerName(game.player1Id) }}
            </span>
            <span class="text-amber-400 text-xl">⚔️</span>
            <span class="font-semibold text-amber-100 parchment-text" :class="{ 'text-green-400 font-bold': game.winner === game.player2Id }">
              {{ getPlayerName(game.player2Id) }}
            </span>
          </div>
          <div class="text-right font-semibold">
            <span v-if="!game.winner" class="text-amber-400 italic parchment-text">Awaiting Battle</span>
            <span v-else-if="game.winner === 'draw'" class="text-yellow-400 parchment-text">🤝 Draw</span>
            <span v-else class="text-green-400 parchment-text">🏆 {{ getPlayerName(game.winner) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Game, Player } from '../../../stores/tournament'

interface Props {
  games: Game[]
  players: Player[]
  selectedRound: number | null
  totalRounds: number
  currentRound: number
  tournamentComplete: boolean
}

const props = defineProps<Props>()

defineEmits<{
  'update:selectedRound': [round: number | null]
}>()

const filteredGames = computed(() => {
  if (props.selectedRound === null) {
    return props.games.sort((a, b) => a.round - b.round)
  }
  return props.games.filter(game => game.round === props.selectedRound)
})

function getPlayerName(playerId: string): string {
  const player = props.players.find(p => p.id === playerId)
  return player?.name || 'Unknown Player'
}
</script>