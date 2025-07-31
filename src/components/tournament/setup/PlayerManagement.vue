<template>
  <div class="card card-hover p-6 sm:p-8 lg:p-12 ornate-border">
    <div class="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
      <span class="text-3xl sm:text-4xl">👥</span>
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-gold parchment-text">Planeswalkers</h2>
    </div>
    
    <div class="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
      <input 
        v-model="newPlayerName"
        @keyup.enter="addPlayer"
        placeholder="⚡ Enter planeswalker name..."
        class="input-glass w-full p-4 sm:p-5 rounded-xl text-lg sm:text-xl font-semibold min-w-0"
      />
      <button 
        @click="addPlayer"
        :disabled="!newPlayerName.trim()"
        class="btn btn-primary px-6 sm:px-8 py-4 sm:py-5 text-lg sm:text-xl w-full sm:w-auto"
      >
        <span class="text-xl sm:text-2xl">➕</span> Summon Planeswalker
      </button>
    </div>

    <div class="space-y-2 sm:space-y-3 mb-6 sm:mb-8 max-h-64 sm:max-h-80 overflow-y-auto" v-if="players.length > 0">
      <div 
        v-for="(player, index) in players" 
        :key="player.id"
        class="glass-dark p-2 sm:p-3 rounded-lg border border-amber-500/40 hover:border-amber-400/60 transition-all duration-300 group"
      >
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-600 to-amber-700 flex items-center justify-center text-amber-100 font-black text-sm sm:text-lg border-2 border-yellow-500/50 shrink-0 self-start sm:self-auto">
            {{ index + 1 }}
          </div>
          <input 
            v-model="player.name"
            @blur="updatePlayerName(player.id, player.name)"
            class="input-glass flex-1 p-2 sm:p-3 rounded-lg font-semibold text-base sm:text-lg min-w-0"
          />
          <button 
            @click="removePlayer(player.id)"
            class="btn btn-danger btn-sm opacity-70 group-hover:opacity-100 transition-opacity text-sm sm:text-base px-2 sm:px-3 py-1 sm:py-2 shrink-0 w-full sm:w-auto"
          >
            🗡️ Banish
          </button>
        </div>
      </div>
    </div>

    <div class="glass-dark p-6 sm:p-8 rounded-xl border-2 border-amber-500/60 ornate-border">
      <div class="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <span class="text-2xl sm:text-3xl">📊</span>
        <h3 class="text-xl sm:text-2xl font-bold text-amber-200 parchment-text">Tournament Codex</h3>
      </div>
      <div class="grid grid-cols-2 gap-4 sm:gap-6 text-center">
        <div class="glass p-4 sm:p-6 rounded-lg border border-yellow-500/40">
          <div class="text-3xl sm:text-4xl font-black text-gradient-gold mb-1 sm:mb-2">{{ players.length }}</div>
          <div class="text-amber-300 font-semibold text-sm sm:text-base parchment-text">Planeswalkers</div>
        </div>
        <div class="glass p-4 sm:p-6 rounded-lg border border-yellow-500/40" v-if="estimatedRounds > 0">
          <div class="text-3xl sm:text-4xl font-black text-gradient-gold mb-1 sm:mb-2">{{ estimatedRounds }}</div>
          <div class="text-amber-300 font-semibold text-sm sm:text-base parchment-text">Rounds of Battle</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Player } from '../../../stores/tournament'

interface Props {
  players: Player[]
  gamesPerOpponent: number
  format: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'add-player': [name: string]
  'remove-player': [playerId: string]
  'update-player-name': [playerId: string, name: string]
}>()

const newPlayerName = ref('')

const estimatedRounds = computed(() => {
  if (props.players.length < 2) return 0
  if (props.format === 'round-robin') {
    return Math.ceil((props.players.length - 1) * props.gamesPerOpponent / 2)
  }
  return 1 // Placeholder for other formats
})

function addPlayer() {
  if (newPlayerName.value.trim()) {
    emit('add-player', newPlayerName.value)
    newPlayerName.value = ''
  }
}

function removePlayer(playerId: string) {
  emit('remove-player', playerId)
}

function updatePlayerName(playerId: string, newName: string) {
  emit('update-player-name', playerId, newName)
}
</script>