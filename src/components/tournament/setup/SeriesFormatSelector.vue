<template>
  <div>
    <label for="gamesPerOpponent" class="block mb-3 sm:mb-4 font-bold text-amber-200 text-lg sm:text-xl parchment-text">Series Format:</label>
    <select 
      id="gamesPerOpponent"
      :value="modelValue"
      @change="$emit('update:modelValue', Number(($event.target as HTMLSelectElement).value))"
      class="input-glass w-full p-4 sm:p-5 rounded-xl text-lg sm:text-xl font-semibold"
    >
      <option value="1">⚡ Single Game (First to 1 win)</option>
      <option value="3">🔥 Best of 3 (First to 2 wins)</option>
      <option value="5">💥 Best of 5 (First to 3 wins)</option>
    </select>
    
    <!-- Series explanation -->
    <div class="mt-3 sm:mt-4 glass-dark p-3 sm:p-4 rounded-lg border border-amber-400/30">
      <div class="flex items-start gap-2 sm:gap-3">
        <span class="text-lg sm:text-xl">📖</span>
        <div class="text-sm sm:text-base text-amber-200 parchment-text">
          <div v-if="modelValue === 1" class="font-semibold">
            Each pairing plays exactly 1 game per round.
          </div>
          <div v-else class="font-semibold">
            Each pairing plays up to {{ modelValue }} games. 
            First player to win {{ Math.ceil(modelValue / 2) }} games wins the series.
          </div>
          <div class="text-xs sm:text-sm text-amber-300 mt-1">
            {{ modelValue === 1 ? 'Fast-paced tournament with quick decisive battles.' : 'More strategic with comeback potential and reduced variance.' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: number
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>