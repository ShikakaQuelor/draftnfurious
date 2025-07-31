<template>
  <div 
    class="card card-hover p-4 lg:p-6 transition-all duration-500"
    :class="{ 
      'border-green-400/60 bg-gradient-to-br from-green-900/20 to-emerald-900/20': series.isComplete,
      'border-yellow-400/40': !series.isComplete 
    }"
  >
    <!-- Series Header -->
    <div class="text-center mb-4 lg:mb-6">
      <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
        <div class="glass-dark px-3 py-2 lg:px-4 lg:py-2 rounded-lg border border-yellow-400/50 w-full sm:w-auto">
          <span class="font-bold text-amber-200 parchment-text text-sm lg:text-base">{{ getPlayerName(series.player1Id) }}</span>
        </div>
        <span class="text-xl lg:text-2xl">⚔️</span>
        <div class="glass-dark px-3 py-2 lg:px-4 lg:py-2 rounded-lg border border-yellow-400/50 w-full sm:w-auto">
          <span class="font-bold text-amber-200 parchment-text text-sm lg:text-base">{{ getPlayerName(series.player2Id) }}</span>
        </div>
      </div>

      <!-- Series Score (for best-of) -->
      <div v-if="gamesPerOpponent > 1" class="mb-4">
        <div class="glass-dark p-3 rounded-lg border border-amber-400/30">
          <div class="flex justify-center items-center gap-4 text-lg font-bold">
            <span class="text-green-400">{{ series.player1Wins }}</span>
            <span class="text-amber-400">-</span>
            <span class="text-green-400">{{ series.player2Wins }}</span>
            <span v-if="series.draws > 0" class="text-yellow-400 text-sm">({{ series.draws }} draws)</span>
          </div>
          <div class="text-xs text-amber-400 mt-1 parchment-text">
            First to {{ series.gamesNeededToWin }} wins
          </div>
        </div>
      </div>
    </div>
    
    <!-- Series Result -->
    <div class="text-center mb-4 lg:mb-6" v-if="series.isComplete">
      <div class="glass-dark p-3 lg:p-4 rounded-xl border border-green-400/50">
        <span v-if="series.seriesWinner === 'draw'" class="text-lg lg:text-xl font-bold text-yellow-400 flex items-center justify-center gap-2 parchment-text">
          <span class="text-xl lg:text-2xl">🤝</span> SERIES DRAW
        </span>
        <span v-else class="text-lg lg:text-xl font-bold text-green-400 flex items-center justify-center gap-2 parchment-text">
          <span class="text-xl lg:text-2xl">🏆</span> {{ getPlayerName(series.seriesWinner!) }} WINS!
        </span>
      </div>
    </div>

    <!-- Individual Games -->
    <div v-if="!series.isComplete || gamesPerOpponent > 1">
      <div class="border-t border-amber-600/30 pt-4 mb-4">
        <h4 class="text-sm font-bold text-amber-300 mb-3 parchment-text text-center">
          {{ gamesPerOpponent > 1 ? 'Individual Games' : 'Game Result' }}
        </h4>
        
        <div class="space-y-2" v-for="game in games" :key="game.id">
          <div class="glass-dark p-3 rounded-lg border border-amber-600/30">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs text-amber-400 parchment-text">Game {{ game.gameNumber }}</span>
              <span v-if="game.winner" class="text-xs font-bold"
                :class="{
                  'text-green-400': game.winner !== 'draw',
                  'text-yellow-400': game.winner === 'draw'
                }">
                {{ game.winner === 'draw' ? 'DRAW' : getPlayerName(game.winner) + ' WIN' }}
              </span>
            </div>
            
            <!-- Game Actions -->
            <GameActions 
              :game="game" 
              :series-complete="series.isComplete"
              :get-player-name="getPlayerName"
              @record-win="$emit('record-win', $event[0], $event[1])"
              @record-draw="$emit('record-draw', $event)"
              @clear-result="$emit('clear-result', $event)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Series Actions (for completed series) -->
    <div class="text-center" v-if="series.isComplete && gamesPerOpponent === 1">
      <button 
        @click="$emit('clear-series-result', series.id)"
        class="btn btn-secondary btn-sm text-xs lg:text-sm"
      >
        🔄 Change Result
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import GameActions from './GameActions.vue'

interface Game {
  id: string
  player1Id: string
  player2Id: string
  winner?: string
  gameNumber: number
}

interface Series {
  id: string
  player1Id: string
  player2Id: string
  player1Wins: number
  player2Wins: number
  draws: number
  gamesNeededToWin: number
  isComplete: boolean
  seriesWinner?: string
}

interface Props {
  series: Series
  games: Game[]
  gamesPerOpponent: number
  getPlayerName: (playerId: string) => string
}

defineProps<Props>()

defineEmits<{
  'record-win': [gameId: string, winnerId: string]
  'record-draw': [gameId: string]
  'clear-result': [gameId: string]
  'clear-series-result': [seriesId: string]
}>()
</script>