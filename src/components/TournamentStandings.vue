<template>
  <div class="mb-8 sm:mb-12">
    <div class="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
      <span class="text-2xl sm:text-4xl">🏆</span>
      <h2 class="text-xl sm:text-2xl lg:text-4xl font-bold text-gradient-gold parchment-text">Hall of Champions</h2>
    </div>
    <div class="card overflow-hidden">
      <!-- Desktop Header -->
      <div class="hidden md:grid grid-cols-5 glass-dark p-4 lg:p-6 font-bold border-b-2 border-yellow-400/60 parchment-text text-amber-200">
        <div>Rank</div>
        <div>Planeswalker</div>
        <div>Victory Points</div>
        <div>Battles</div>
        <div>W-D-L</div>
      </div>
      
      <!-- Mobile/Desktop Player Rows -->
      <div 
        v-for="(player, index) in standings" 
        :key="player.id"
        class="p-3 sm:p-4 lg:p-6 border-b border-yellow-400/30 transition-colors hover:bg-amber-900/20"
        :class="{ 
          'bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border-l-4 border-yellow-500': index === 0 && tournamentComplete,
          'bg-amber-900/10': index < 3 && tournamentComplete
        }"
      >
        <!-- Mobile Layout -->
        <div class="md:hidden">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-lg font-black"
                   :class="{
                     'bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900': index === 0,
                     'bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900': index > 0
                   }">
                {{ index + 1 }}
              </div>
              <span v-if="index === 0 && tournamentComplete" class="text-xl sm:text-2xl">👑</span>
              <span class="font-semibold text-amber-100 parchment-text text-sm sm:text-base">{{ player.name }}</span>
            </div>
            <div class="font-bold text-gradient-gold text-lg sm:text-xl">{{ player.points }}</div>
          </div>
          <div class="flex justify-between text-xs sm:text-sm text-amber-200">
            <span>{{ getPlayerGameCount(player.id) }} battles</span>
            <span class="font-mono">{{ getPlayerRecord(player.id) }}</span>
          </div>
        </div>
        
        <!-- Desktop Layout -->
        <div class="hidden md:grid grid-cols-5 items-center">
          <div class="flex items-center gap-3 font-bold">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg font-black"
                 :class="{
                   'bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900': index === 0,
                   'bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900': index > 0
                 }">
              {{ index + 1 }}
            </div>
            <span v-if="index === 0 && tournamentComplete" class="text-2xl">👑</span>
          </div>
          <div class="font-semibold text-amber-100 parchment-text">{{ player.name }}</div>
          <div class="font-bold text-gradient-gold text-xl">{{ player.points }}</div>
          <div class="text-amber-200">{{ getPlayerGameCount(player.id) }}</div>
          <div class="text-amber-200 font-mono">{{ getPlayerRecord(player.id) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player, Game } from '../stores/tournament'

interface Props {
  standings: Player[]
  games: Game[]
  tournamentComplete: boolean
}

const props = defineProps<Props>()

function getPlayerGameCount(playerId: string): number {
  return props.games.filter(game => 
    (game.player1Id === playerId || game.player2Id === playerId) && 
    game.winner !== undefined
  ).length
}

function getPlayerRecord(playerId: string): string {
  const playerGames = props.games.filter(game => 
    (game.player1Id === playerId || game.player2Id === playerId) && 
    game.winner !== undefined
  )
  
  let wins = 0
  let draws = 0
  let losses = 0
  
  playerGames.forEach(game => {
    if (game.winner === 'draw') {
      draws++
    } else if (game.winner === playerId) {
      wins++
    } else {
      losses++
    }
  })
  
  return `${wins}-${draws}-${losses}`
}
</script>