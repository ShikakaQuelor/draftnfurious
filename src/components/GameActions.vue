<template>
  <div class="space-y-1" v-if="!game.winner && !seriesComplete">
    <button 
      @click="$emit('record-win', game.id, game.player1Id)"
      class="btn btn-success w-full text-xs py-1"
    >
      🏆 {{ getPlayerName(game.player1Id) }} Wins
    </button>
    
    <button 
      @click="$emit('record-draw', game.id)"
      class="btn btn-warning w-full text-xs py-1"
    >
      🤝 Draw
    </button>
    
    <button 
      @click="$emit('record-win', game.id, game.player2Id)"
      class="btn btn-success w-full text-xs py-1"
    >
      🏆 {{ getPlayerName(game.player2Id) }} Wins
    </button>
  </div>

  <div class="text-center" v-else-if="game.winner">
    <button 
      @click="$emit('clear-result', game.id)"
      class="btn btn-secondary btn-sm text-xs"
    >
      🔄 Change
    </button>
  </div>
</template>

<script setup lang="ts">
interface Game {
  id: string
  player1Id: string
  player2Id: string
  winner?: string
  gameNumber: number
}

interface Props {
  game: Game
  seriesComplete: boolean
  getPlayerName: (playerId: string) => string
}

defineProps<Props>()

defineEmits<{
  'record-win': [gameId: string, winnerId: string]
  'record-draw': [gameId: string]
  'clear-result': [gameId: string]
}>()
</script>