<template>
  <div class="text-center">
    <!-- Round Complete Section -->
    <div v-if="canAdvanceRound || tournamentComplete" class="mt-8 lg:mt-12">
      <div class="card p-6 lg:p-8 max-w-2xl mx-auto border-2 border-green-500/60 bg-gradient-to-br from-green-900/20 to-emerald-900/20">
        <div class="text-center">
          <div class="flex items-center justify-center gap-3 mb-4 lg:mb-6">
            <span class="text-3xl lg:text-4xl">🎮</span>
            <h3 class="text-xl lg:text-2xl font-bold text-green-300 parchment-text">Round Complete!</h3>
          </div>

          <button 
            @click="$emit('advance-round')"
            :disabled="!canAdvanceRound"
            class="btn btn-primary btn-large text-lg lg:text-xl px-6 py-3 lg:px-8 lg:py-4 mb-4 lg:mb-6 w-full sm:w-auto"
            v-if="!isLastRound"
          >
            <span class="flex items-center justify-center gap-2 lg:gap-3">
              <span>🚀</span>
              <span class="text-sm sm:text-base lg:text-lg">ADVANCE TO ROUND {{ currentRound + 1 }}</span>
              <span>🚀</span>
            </span>
          </button>
          
          <div v-else-if="tournamentComplete" class="text-center">
            <div class="text-4xl lg:text-6xl mb-4">🎉</div>
            <h2 class="text-2xl lg:text-3xl font-black text-gradient mb-4 parchment-text">TOURNAMENT COMPLETE!</h2>
            <p class="text-lg lg:text-xl text-amber-200 parchment-text mb-4 lg:mb-6">Check the overview for final standings</p>
            <button 
              @click="$emit('go-to-summary')"
              class="btn btn-primary btn-large text-lg lg:text-xl px-6 py-3 lg:px-8 lg:py-4 w-full sm:w-auto"
            >
              <span class="flex items-center justify-center gap-2 lg:gap-3">
                <span>📜</span>
                <span class="text-sm sm:text-base lg:text-lg">VIEW TOURNAMENT SUMMARY</span>
                <span>🏆</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls Tab Content -->
    <div v-else class="card p-6 lg:p-10 max-w-2xl mx-auto">
      <div class="flex items-center justify-center gap-3 mb-6 lg:mb-8">
        <span class="text-3xl lg:text-4xl">🎮</span>
        <h3 class="text-2xl lg:text-3xl font-bold text-gradient-gold parchment-text">Round Controls</h3>
      </div>

      <!-- Round Navigation -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6 lg:mb-8">
        <button 
          @click="$emit('previous-round')"
          :disabled="currentRound <= 1"
          class="btn btn-secondary px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="flex items-center justify-center gap-2">
            <span>⬅️</span>
            <span>PREVIOUS ROUND</span>
          </span>
        </button>

        <button 
          @click="$emit('advance-round')"
          :disabled="!canAdvanceRound"
          class="btn btn-primary btn-large text-lg lg:text-xl px-6 py-3 lg:px-8 lg:py-4 flex-1"
          v-if="!isLastRound"
        >
          <span class="flex items-center justify-center gap-2 lg:gap-3">
            <span>🚀</span>
            <span class="text-sm sm:text-base lg:text-lg">ADVANCE TO ROUND {{ currentRound + 1 }}</span>
            <span>🚀</span>
          </span>
        </button>
      </div>
      
      <!-- Tournament Complete Message -->
      <div v-if="tournamentComplete" class="text-center mb-6 lg:mb-8">
        <div class="text-4xl lg:text-6xl mb-4">🎉</div>
        <h2 class="text-2xl lg:text-3xl font-black text-gradient mb-4 parchment-text">TOURNAMENT COMPLETE!</h2>
        <p class="text-lg lg:text-xl text-amber-200 parchment-text">Check the overview for final standings</p>
      </div>
      
      <!-- Waiting Message -->
      <p v-if="!canAdvanceRound && !isLastRound" class="text-amber-300 italic text-base lg:text-lg flex items-center justify-center gap-2 parchment-text mb-6 lg:mb-8">
        <span>⏳</span> Complete all battles to advance to the next round
      </p>

      <!-- Danger Zone -->
      <div class="border-t-2 border-amber-600/30 pt-6 lg:pt-8 mt-6 lg:mt-8">
        <div class="glass-dark p-4 lg:p-6 rounded-xl border border-red-400/50">
          <div class="mb-4">
            <h4 class="text-lg lg:text-xl font-bold text-red-300 mb-2 parchment-text">⚠️ Danger Zone</h4>
            <p class="text-amber-400 text-sm parchment-text">This will end the current tournament permanently</p>
          </div>
          <button 
            @click="$emit('show-reset-confirm')"
            class="btn btn-danger px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base"
          >
            🗡️ End Tournament
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  canAdvanceRound: boolean
  tournamentComplete: boolean
  isLastRound: boolean
  currentRound: number
}

defineProps<Props>()

defineEmits<{
  'advance-round': []
  'previous-round': []
  'go-to-summary': []
  'show-reset-confirm': []
}>()
</script>