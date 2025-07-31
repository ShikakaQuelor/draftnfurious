<template>
  <div class="min-h-screen flex flex-col">
    <header class="glass-dark border-b-2 border-yellow-600/60 p-4 sm:p-6 lg:p-8 shadow-2xl ornate-border">
      <div class="text-center mb-6 sm:mb-8">
        <router-link to="/" class="no-underline group">
          <h1 class="text-3xl sm:text-4xl lg:text-6xl font-black text-gradient mb-2 sm:mb-4 group-hover:scale-105 transition-transform duration-300 parchment-text">
            ⚔️ Draft N' Furious ⚔️
          </h1>
          <p class="text-amber-200 text-sm sm:text-lg lg:text-2xl font-semibold tracking-wider parchment-text">MTG Draft Tournament Manager</p>
          <div class="mtg-separator mt-2 sm:mt-4"></div>
        </router-link>
      </div>
      
      <nav class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6" v-if="tournamentStore.tournamentStarted">
        <router-link 
          to="/tournament/current-round"
          class="px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-4 card border-2 border-yellow-600/60 text-amber-100 rounded-lg cursor-pointer font-bold transition-all duration-300 text-sm sm:text-base lg:text-lg hover:border-yellow-500 hover:bg-yellow-600/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-600/25 parchment-text text-center"
          active-class="border-yellow-500 bg-yellow-600/30 shadow-lg shadow-yellow-600/30"
        >
          ⚔️ Current Round
        </router-link>
        <router-link 
          to="/tournament/overview"
          class="px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-4 card border-2 border-yellow-600/60 text-amber-100 rounded-lg cursor-pointer font-bold transition-all duration-300 text-sm sm:text-base lg:text-lg hover:border-yellow-500 hover:bg-yellow-600/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-600/25 parchment-text text-center"
          active-class="border-yellow-500 bg-yellow-600/30 shadow-lg shadow-yellow-600/30"
        >
          📜 Overview
        </router-link>
      </nav>
    </header>

    <main class="flex-1 p-4 sm:p-6 lg:p-8 relative">
      <div class="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-yellow-900/10 pointer-events-none"></div>
      <div class="relative z-10">
        <router-view />
      </div>
    </main>

    <footer class="glass-dark border-t-2 border-yellow-600/60 p-3 sm:p-4 lg:p-6 shadow-2xl" v-if="tournamentStore.tournamentStarted">
      <div class="flex flex-col lg:flex-row justify-between items-center max-w-7xl mx-auto gap-4 lg:gap-6">
        <div class="flex items-center gap-2 sm:gap-4">
          <div class="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-500 animate-pulse"></div>
          <span v-if="tournamentStore.tournamentComplete" class="px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg font-bold text-sm sm:text-base lg:text-xl bg-gradient-to-r from-green-700 to-green-600 text-green-100 shadow-lg border border-green-500/50 parchment-text">
            🏆 Tournament Complete!
          </span>
          <span v-else class="px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg font-bold text-sm sm:text-base lg:text-xl bg-gradient-to-r from-yellow-700 to-yellow-600 text-yellow-100 shadow-lg border border-yellow-500/50 parchment-text">
            ⚔️ Round {{ tournamentStore.currentRound }} of {{ tournamentStore.totalRounds }}
          </span>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-center text-amber-200 parchment-text">
          <div class="flex items-center gap-2 sm:gap-3">
            <span class="text-xl sm:text-2xl lg:text-3xl">👑</span>
            <span class="font-semibold text-sm sm:text-base lg:text-lg text-center sm:text-left">
              {{ tournamentStore.standings[0]?.name || 'No champion yet' }} 
              <span class="text-yellow-400 font-bold">({{ tournamentStore.standings[0]?.points || 0 }} pts)</span>
            </span>
          </div>
          <div class="flex items-center gap-2 sm:gap-3" v-if="tournamentStore.timerActive && tournamentStore.roundTimeRemaining > 0">
            <span class="text-xl sm:text-2xl lg:text-3xl">⏳</span>
            <span class="font-bold text-orange-300 font-mono text-base sm:text-lg lg:text-xl">
              {{ formatTime(tournamentStore.roundTimeRemaining) }}
            </span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useTournamentStore } from './stores/tournament'
import { useRouter } from 'vue-router'

const router = useRouter()
const tournamentStore = useTournamentStore()

function resetTournament() {
  const success = tournamentStore.resetTournament()
  if (success) {
    router.push('/')
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style>
/* Remove all scoped styles - using global Tailwind classes only */
.app-main > * {
  animation: fadeIn 0.3s ease-out;
}
</style>
