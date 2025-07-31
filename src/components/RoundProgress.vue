<template>
  <div class="card p-4 lg:p-6 mb-6 lg:mb-8 bg-gradient-to-r from-amber-900/20 to-yellow-900/20">
    <div class="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
      <div class="flex items-center gap-3 text-center lg:text-left">
        <span class="text-2xl lg:text-3xl">📊</span>
        <div>
          <h3 class="text-lg lg:text-xl font-bold text-gradient-bronze parchment-text">Round Progress</h3>
          <div class="text-amber-300 parchment-text text-sm lg:text-base">
            {{ completedCount }} / {{ totalCount }} 
            {{ gamesPerOpponent > 1 ? 'series' : 'battles' }} complete
          </div>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 w-full lg:w-auto">
        <div class="w-full sm:w-32 bg-amber-900/50 rounded-full h-3 overflow-hidden border border-yellow-400/30">
          <div 
            class="progress-glow h-full transition-all duration-1000 rounded-full"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="text-xl lg:text-2xl font-black text-gradient-gold">
          {{ Math.round(progressPercentage) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  completedCount: number
  totalCount: number
  gamesPerOpponent: number
}

const props = defineProps<Props>()

const progressPercentage = computed(() => {
  if (props.totalCount === 0) return 0
  return (props.completedCount / props.totalCount) * 100
})
</script>