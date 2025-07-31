<template>
  <div>
    <label for="roundTimer" class="block mb-3 sm:mb-4 font-bold text-amber-200 text-lg sm:text-xl parchment-text">⏳ Round Timer (minutes):</label>
    <input 
      id="roundTimer"
      type="number" 
      min="0" 
      max="120" 
      :value="modelValue"
      @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
      placeholder="Leave empty for eternal rounds..."
      class="input-glass w-full p-4 sm:p-5 rounded-xl text-lg sm:text-xl font-semibold text-center"
    />
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