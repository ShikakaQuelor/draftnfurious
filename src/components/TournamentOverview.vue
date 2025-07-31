<template>
  <div class="max-w-7xl mx-auto p-3 sm:p-6">
    <!-- Tournament Header -->
    <TournamentHeader
      :format="config.format"
      :current-round="currentRound"
      :total-rounds="totalRounds"
      :tournament-complete="tournamentComplete"
    />

    <!-- Final Standings -->
    <TournamentStandings
      :standings="standings"
      :games="games"
      :tournament-complete="tournamentComplete"
    />

    <!-- Battle History -->
    <BattleHistory
      :games="games"
      :players="players"
      :selected-round="selectedRound"
      :total-rounds="totalRounds"
      :current-round="currentRound"
      :tournament-complete="tournamentComplete"
      @update:selected-round="selectedRound = $event"
    />

    <!-- Tournament Statistics -->
    <TournamentStatistics
      :games="games"
      :players-count="players.length"
      :round-timer-minutes="config.roundTimerMinutes"
      :points-per-win="config.pointsPerWin"
      :points-per-draw="config.pointsPerDraw"
      :points-per-loss="config.pointsPerLoss"
      :tournament-complete="tournamentComplete"
      @reset-tournament="resetTournament"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTournamentStore } from '../stores/tournament'
import TournamentHeader from './tournament/overview/TournamentHeader.vue'
import TournamentStandings from './tournament/overview/TournamentStandings.vue'
import BattleHistory from './tournament/overview/BattleHistory.vue'
import TournamentStatistics from './tournament/overview/TournamentStatistics.vue'

const tournamentStore = useTournamentStore()

const {
  config,
  players,
  games,
  currentRound,
  totalRounds,
  standings,
  tournamentComplete,
  resetTournament
} = tournamentStore

const selectedRound = ref<number | null>(null)
</script>

<style scoped>
/* Remove all custom styles - using Tailwind now */
</style>