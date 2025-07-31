<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
    <div class="text-center mb-8 sm:mb-12 px-4 sm:px-6">
      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-gradient mb-4 sm:mb-6 parchment-text">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6">
          <span class="text-2xl sm:text-3xl lg:text-4xl">⚜️</span>
          <span class="text-center">Tournament Setup</span>
          <span class="text-2xl sm:text-3xl lg:text-4xl">⚜️</span>
        </div>
      </h1>
      <p class="text-amber-200 text-lg sm:text-xl lg:text-2xl parchment-text px-4">Configure your Magic: The Gathering Draft Tournament</p>
      <div class="mtg-separator mt-4 sm:mt-6"></div>
    </div>
    
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
      <!-- Tournament Configuration -->
      <TournamentConfiguration
        :config="config"
        @update:config="updateTournamentConfig"
      />

      <!-- Players Management -->
      <PlayerManagement
        :players="players"
        :games-per-opponent="config.gamesPerOpponent"
        :format="config.format"
        @add-player="addPlayer"
        @remove-player="removePlayer"
        @update-player-name="updatePlayerName"
      />
    </div>

    <!-- Start Tournament Section -->
    <TournamentLaunchSection
      :players="players"
      @start-tournament="startTournament"
    />
  </div>
</template>

<script setup lang="ts">
import { useTournamentStore } from '../stores/tournament'
import { useRouter } from 'vue-router'
import TournamentConfiguration from './tournament/setup/TournamentConfiguration.vue'
import PlayerManagement from './tournament/setup/PlayerManagement.vue'
import TournamentLaunchSection from './tournament/setup/TournamentLaunchSection.vue'

const router = useRouter()
const tournamentStore = useTournamentStore()
const { config, players } = tournamentStore

function updateTournamentConfig(newConfig: any) {
  tournamentStore.updateConfig(newConfig)
}

function addPlayer(name: string) {
  tournamentStore.addPlayer(name)
}

function removePlayer(playerId: string) {
  tournamentStore.removePlayer(playerId)
}

function updatePlayerName(playerId: string, newName: string) {
  tournamentStore.updatePlayerName(playerId, newName)
}

function startTournament() {
  try {
    const success = tournamentStore.startTournament()
    if (success) {
      router.push('/tournament/current-round')
    }
  } catch (error) {
    console.error('Error starting tournament:', error)
  }
}
</script>

<style scoped>
/* Remove all custom styles - using Tailwind now */
</style>