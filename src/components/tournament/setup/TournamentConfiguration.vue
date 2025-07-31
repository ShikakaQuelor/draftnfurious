<template>
  <div class="card card-hover p-6 sm:p-8 lg:p-12 ornate-border">
    <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
      <span class="text-3xl sm:text-4xl">⚙️</span>
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-gold parchment-text">Configuration</h2>
    </div>
    
    <div class="space-y-6 sm:space-y-8">
      <FormatSelector 
        v-model="localConfig.format" 
        @update:model-value="$emit('update:config', localConfig)"
      />

      <SeriesFormatSelector 
        v-model="localConfig.gamesPerOpponent" 
        @update:model-value="$emit('update:config', localConfig)"
      />

      <RoundTimerInput 
        v-model="localConfig.roundTimerMinutes" 
        @update:model-value="$emit('update:config', localConfig)"
      />

      <ScoringSystemForm 
        v-model:pointsPerWin="localConfig.pointsPerWin"
        v-model:pointsPerDraw="localConfig.pointsPerDraw"
        v-model:pointsPerLoss="localConfig.pointsPerLoss"
        @update="$emit('update:config', localConfig)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { TournamentConfig } from '../../../stores/tournament'
import FormatSelector from './FormatSelector.vue'
import SeriesFormatSelector from './SeriesFormatSelector.vue'
import RoundTimerInput from './RoundTimerInput.vue'
import ScoringSystemForm from './ScoringSystemForm.vue'

interface Props {
  config: TournamentConfig
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:config': [config: TournamentConfig]
}>()

const localConfig = reactive<TournamentConfig>({ ...props.config })

// Watch for external config changes
watch(() => props.config, (newConfig) => {
  Object.assign(localConfig, newConfig)
}, { deep: true })
</script>