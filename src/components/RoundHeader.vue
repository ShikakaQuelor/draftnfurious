<template>
  <div class="text-center mb-6 lg:mb-10 card p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-amber-900/40 to-yellow-900/40">
    <h1 class="text-2xl sm:text-3xl lg:text-5xl font-black text-gradient mb-4 lg:mb-6 parchment-text">
      ⚔️ Round {{ currentRound }} of {{ totalRounds }} ⚔️
    </h1>
    
    <!-- Best of indicator -->
    <div v-if="gamesPerOpponent > 1" class="mb-4">
      <div class="glass-dark px-4 py-2 rounded-lg border border-amber-400/50 inline-block">
        <span class="text-amber-200 font-semibold parchment-text">
          🏆 Best of {{ gamesPerOpponent }} 
          ({{ Math.ceil(gamesPerOpponent / 2) }} wins needed)
        </span>
      </div>
    </div>
    
    <div class="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-8" v-if="roundTimerMinutes">
      <div class="glass-dark p-4 lg:p-6 rounded-xl border border-orange-400/50 w-full sm:w-auto">
        <div class="flex items-center gap-3 lg:gap-4 justify-center sm:justify-start">
          <span class="text-2xl lg:text-3xl">⏱️</span>
          <div class="text-center sm:text-left">
            <div class="text-orange-300 font-semibold text-sm lg:text-lg parchment-text">Time Remaining</div>
            <div class="text-xl lg:text-3xl font-black font-mono" :class="{ 'text-red-400 animate-pulse': timeWarning }">
              {{ formatTime(roundTimeRemaining) }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-3 lg:gap-4 w-full sm:w-auto">
        <button 
          @click="$emit('start-timer')" 
          :disabled="timerActive"
          class="btn btn-success flex-1 sm:flex-none text-sm lg:text-base"
        >
          ▶️ Start
        </button>
        <button 
          @click="$emit('stop-timer')" 
          :disabled="!timerActive"
          class="btn btn-danger flex-1 sm:flex-none text-sm lg:text-base"
        >
          ⏹️ Stop
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentRound: number
  totalRounds: number
  gamesPerOpponent: number
  roundTimerMinutes?: number
  roundTimeRemaining: number
  timerActive: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'start-timer': []
  'stop-timer': []
}>()

const timeWarning = computed(() => {
  return props.roundTimeRemaining < 300 // Warning when less than 5 minutes
})

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>