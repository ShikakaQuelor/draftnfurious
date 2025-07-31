<template>
  <div class="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6">
    <!-- Round Header -->
    <RoundHeader 
      :current-round="tournamentStore.currentRound"
      :total-rounds="tournamentStore.totalRounds"
      :games-per-opponent="tournamentStore.config.gamesPerOpponent"
      :round-timer-minutes="tournamentStore.config.roundTimerMinutes"
      :round-time-remaining="tournamentStore.roundTimeRemaining"
      :timer-active="tournamentStore.timerActive"
      @start-timer="tournamentStore.startRoundTimer"
      @stop-timer="tournamentStore.stopRoundTimer"
    />

    <!-- Tab Navigation -->
    <div class="flex flex-col sm:flex-row justify-center gap-2 mb-6 lg:mb-8 card p-2 bg-amber-900/20">
      <button 
        @click="activeTab = 'battles'"
        :class="{ 'border-yellow-500 bg-yellow-600/30': activeTab === 'battles' }"
        class="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-3 border-2 border-yellow-600/60 text-amber-100 rounded-lg font-bold transition-all duration-300 hover:border-yellow-500 hover:bg-yellow-600/20 parchment-text text-sm sm:text-base"
      >
        ⚔️ Current Round
      </button>
      <button 
        @click="activeTab = 'standings'"
        :class="{ 'border-yellow-500 bg-yellow-600/30': activeTab === 'standings' }"
        class="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-3 border-2 border-yellow-600/60 text-amber-100 rounded-lg font-bold transition-all duration-300 hover:border-yellow-500 hover:bg-yellow-600/20 parchment-text text-sm sm:text-base"
      >
        👑 Current Standings
      </button>
      <button 
        v-if="!tournamentStore.canAdvanceRound || tournamentStore.isLastRound"
        @click="activeTab = 'controls'"
        :class="{ 'border-yellow-500 bg-yellow-600/30': activeTab === 'controls' }"
        class="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-3 border-2 border-yellow-600/60 text-amber-100 rounded-lg font-bold transition-all duration-300 hover:border-yellow-500 hover:bg-yellow-600/20 parchment-text text-sm sm:text-base"
      >
        🎮 Round Controls
      </button>
    </div>

    <!-- Tab Content -->
    <div class="min-h-96">
      <!-- Current Round Tab (Series + Progress) -->
      <div v-if="activeTab === 'battles'">
        <!-- Progress Section -->
        <RoundProgress 
          :completed-count="completedSeries"
          :total-count="tournamentStore.currentRoundSeries.length"
          :games-per-opponent="tournamentStore.config.gamesPerOpponent"
        />

        <!-- Current Series -->
        <div class="flex items-center gap-3 mb-6 lg:mb-8">
          <span class="text-3xl lg:text-4xl">🎮</span>
          <h2 class="text-2xl lg:text-3xl font-bold text-gradient-gold parchment-text">
            Active {{ tournamentStore.config.gamesPerOpponent > 1 ? 'Series' : 'Battles' }}
          </h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 lg:gap-6">
          <SeriesCard
            v-for="series in tournamentStore.currentRoundSeries" 
            :key="series.id"
            :series="series"
            :games="getSeriesGames(series.id)"
            :games-per-opponent="tournamentStore.config.gamesPerOpponent"
            :get-player-name="getPlayerName"
            @record-win="recordWin"
            @record-draw="recordDraw"
            @clear-result="clearResult"
            @clear-series-result="clearSeriesResult"
          />
        </div>

        <!-- Auto-show round controls when ready -->
        <RoundControls 
          v-if="tournamentStore.canAdvanceRound || tournamentStore.tournamentComplete"
          :can-advance-round="tournamentStore.canAdvanceRound"
          :tournament-complete="tournamentStore.tournamentComplete"
          :is-last-round="tournamentStore.isLastRound"
          :current-round="tournamentStore.currentRound"
          @advance-round="tournamentStore.advanceToNextRound"
          @go-to-summary="goToSummary"
          @show-reset-confirm="showResetConfirm = true"
        />
      </div>

      <!-- Current Standings Tab -->
      <div v-if="activeTab === 'standings'">
        <TournamentStandings 
          :standings="tournamentStore.standings" 
          :games="tournamentStore.games"
          :tournament-complete="tournamentStore.tournamentComplete"
        />
      </div>

      <!-- Round Controls Tab -->
      <div v-if="activeTab === 'controls'">
        <RoundControls 
          :can-advance-round="tournamentStore.canAdvanceRound"
          :tournament-complete="tournamentStore.tournamentComplete"
          :is-last-round="tournamentStore.isLastRound"
          :current-round="tournamentStore.currentRound"
          @advance-round="tournamentStore.advanceToNextRound"
          @go-to-summary="goToSummary"
          @show-reset-confirm="showResetConfirm = true"
        />
      </div>
    </div>

    <!-- Reset Confirmation Modal -->
    <div v-if="showResetConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="showResetConfirm = false">
      <div class="card p-6 lg:p-8 max-w-md w-full" @click.stop>
        <div class="text-center mb-6">
          <span class="text-4xl lg:text-6xl mb-4 block">⚠️</span>
          <h3 class="text-xl lg:text-2xl font-bold text-red-300 mb-4 parchment-text">End Tournament?</h3>
          <p class="text-amber-200 parchment-text text-sm lg:text-base">This will permanently end the current tournament and return to setup. This cannot be undone.</p>
        </div>
        <div class="flex gap-4">
          <button @click="showResetConfirm = false" class="btn btn-secondary flex-1 text-sm lg:text-base">
            Cancel
          </button>
          <button @click="confirmReset" class="btn btn-danger flex-1 text-sm lg:text-base">
            🗡️ End Tournament
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTournamentStore } from '../../../stores/tournament'
import { useRouter } from 'vue-router'
import RoundHeader from '../../RoundHeader.vue'
import RoundProgress from '../../RoundProgress.vue'
import SeriesCard from '../../SeriesCard.vue'
import TournamentStandings from '../../TournamentStandings.vue'
import RoundControls from '../../RoundControls.vue'

const router = useRouter()
const tournamentStore = useTournamentStore()

const activeTab = ref('battles')
const showResetConfirm = ref(false)

const completedSeries = computed(() => {
  return tournamentStore.currentRoundSeries.filter(series => series.isComplete).length
})

function getPlayerName(playerId: string): string {
  const player = tournamentStore.players.find(p => p.id === playerId)
  return player?.name || 'Unknown Player'
}

function getSeriesGames(seriesId: string) {
  return tournamentStore.getSeriesGames(seriesId)
}

function recordWin(gameId: string, winnerId: string) {
  tournamentStore.recordGameResult(gameId, winnerId)
}

function recordDraw(gameId: string) {
  tournamentStore.recordGameDraw(gameId)
}

function clearResult(gameId: string) {
  tournamentStore.clearGameResult(gameId)
}

function clearSeriesResult(seriesId: string) {
  const seriesGames = tournamentStore.getSeriesGames(seriesId)
  seriesGames.forEach(game => {
    if (game.winner) {
      tournamentStore.clearGameResult(game.id)
    }
  })
}

function confirmReset() {
  tournamentStore.resetTournament()
  showResetConfirm.value = false
  router.push('/tournament/setup')
}

function goToSummary() {
  router.push('/tournament/overview')
}
</script>

<style scoped>
/* Remove all custom styles - using Tailwind now */
</style>