<template>
  <div>
    <label for="format" class="block mb-3 sm:mb-4 font-bold text-amber-200 text-lg sm:text-xl parchment-text">Tournament Format:</label>
    <select 
      id="format" 
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="input-glass w-full p-4 sm:p-5 rounded-xl text-lg sm:text-xl font-semibold"
    >
      <option value="round-robin">🔄 Round Robin</option>
      <option value="swiss">🎯 Swiss System</option>
      <option value="single-elimination">⚔️ Single Elimination</option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>