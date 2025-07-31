<template>
  <div class="pt-4 sm:pt-6">
    <h3 class="text-xl sm:text-2xl font-bold text-gradient-bronze mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 parchment-text">
      <span>⚖️</span> Scoring System
    </h3>
    
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <div class="glass-dark p-4 sm:p-6 rounded-xl border border-green-500/50">
        <label for="pointsPerWin" class="block mb-2 sm:mb-3 font-semibold text-green-300 text-xs sm:text-sm parchment-text">🏆 Win:</label>
        <input 
          id="pointsPerWin"
          type="number" 
          min="0" 
          :value="pointsPerWin"
          @input="$emit('update:pointsPerWin', Number(($event.target as HTMLInputElement).value))"
          class="input-glass w-full p-3 sm:p-4 rounded-lg text-center font-bold text-xl sm:text-2xl"
        />
      </div>

      <div class="glass-dark p-4 sm:p-6 rounded-xl border border-yellow-500/50">
        <label for="pointsPerDraw" class="block mb-2 sm:mb-3 font-semibold text-yellow-300 text-xs sm:text-sm parchment-text">🤝 Draw:</label>
        <input 
          id="pointsPerDraw"
          type="number" 
          min="0" 
          :value="pointsPerDraw"
          @input="$emit('update:pointsPerDraw', Number(($event.target as HTMLInputElement).value))"
          class="input-glass w-full p-3 sm:p-4 rounded-lg text-center font-bold text-xl sm:text-2xl"
        />
      </div>

      <div class="glass-dark p-4 sm:p-6 rounded-xl border border-red-500/50">
        <label for="pointsPerLoss" class="block mb-2 sm:mb-3 font-semibold text-red-300 text-xs sm:text-sm parchment-text">💀 Loss:</label>
        <input 
          id="pointsPerLoss"
          type="number" 
          min="0" 
          :value="pointsPerLoss"
          @input="$emit('update:pointsPerLoss', Number(($event.target as HTMLInputElement).value))"
          class="input-glass w-full p-3 sm:p-4 rounded-lg text-center font-bold text-xl sm:text-2xl"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  pointsPerWin: number
  pointsPerDraw: number
  pointsPerLoss: number
}

defineProps<Props>()

defineEmits<{
  'update:pointsPerWin': [value: number]
  'update:pointsPerDraw': [value: number]
  'update:pointsPerLoss': [value: number]
  'update': []
}>()
</script>