import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Player {
    id: string
    name: string
    points: number
}

export interface Game {
    id: string
    player1Id: string
    player2Id: string
    winner?: string // player id of winner, undefined if not played yet
    round: number
    seriesId: string // Links games that are part of the same series
    gameNumber: number // Which game in the series (1, 2, 3, etc.)
}

export interface Series {
    id: string
    player1Id: string
    player2Id: string
    round: number
    gamesNeededToWin: number
    player1Wins: number
    player2Wins: number
    draws: number
    seriesWinner?: string
    isComplete: boolean
}

export interface TournamentConfig {
    playerCount: number
    format: 'round-robin' | 'swiss' | 'single-elimination'
    totalGames?: number
    gamesPerOpponent: number
    roundTimerMinutes?: number
    pointsPerWin: number
    pointsPerDraw: number
    pointsPerLoss: number
}

export const useTournamentStore = defineStore('tournament', () => {
    // State
    const config = ref<TournamentConfig>({
        playerCount: 4,
        format: 'round-robin',
        gamesPerOpponent: 1,
        pointsPerWin: 3,
        pointsPerDraw: 1,
        pointsPerLoss: 0
    })

    const players = ref<Player[]>([])
    const games = ref<Game[]>([])
    const series = ref<Series[]>([])
    const currentRound = ref<number>(1)
    const isSetupComplete = ref<boolean>(false)
    const tournamentStarted = ref<boolean>(false)

    // Timer state
    const roundTimeRemaining = ref<number>(0)
    const timerActive = ref<boolean>(false)
    let timerInterval: number | null = null

    // Computed
    const totalRounds = computed(() => {
        if (config.value.format === 'round-robin') {
            // For round robin, we need players.length - 1 rounds for each player to play everyone once
            return players.value.length > 1 ? players.value.length - 1 : 0
        } else if (config.value.format === 'single-elimination') {
            // For single elimination, we need log2(players) rounds to determine a winner
            return players.value.length > 1 ? Math.ceil(Math.log2(players.value.length)) : 0
        }
        // Add other format calculations as needed
        return 1
    })

    const currentRoundSeries = computed(() => {
        return series.value.filter(s => s.round === currentRound.value)
    })

    const currentRoundGames = computed(() => {
        return games.value.filter(game => game.round === currentRound.value)
    })

    const canAdvanceRound = computed(() => {
        // All series in current round must be complete
        return currentRoundSeries.value.every(s => s.isComplete)
    })

    const standings = computed(() => {
        return [...players.value].sort((a, b) => b.points - a.points)
    })

    const isLastRound = computed(() => {
        return currentRound.value >= totalRounds.value
    })

    const tournamentComplete = computed(() => {
        return isLastRound.value && canAdvanceRound.value
    })

    // Helper function to get games for a specific series
    const getSeriesGames = (seriesId: string) => {
        return games.value.filter(game => game.seriesId === seriesId).sort((a, b) => a.gameNumber - b.gameNumber)
    }

    // Helper function to update series status
    function updateSeriesStatus(seriesId: string) {
        const seriesData = series.value.find(s => s.id === seriesId)
        if (!seriesData) return

        const seriesGames = getSeriesGames(seriesId)

        // Count wins and draws
        seriesData.player1Wins = seriesGames.filter(g => g.winner === seriesData.player1Id).length
        seriesData.player2Wins = seriesGames.filter(g => g.winner === seriesData.player2Id).length
        seriesData.draws = seriesGames.filter(g => g.winner === 'draw').length

        // Check if series is complete
        const gamesNeeded = seriesData.gamesNeededToWin
        if (seriesData.player1Wins >= gamesNeeded) {
            seriesData.seriesWinner = seriesData.player1Id
            seriesData.isComplete = true
        } else if (seriesData.player2Wins >= gamesNeeded) {
            seriesData.seriesWinner = seriesData.player2Id
            seriesData.isComplete = true
        } else if (config.value.gamesPerOpponent > 1) {
            // For best-of series, check if it's mathematically impossible for either player to win
            const gamesPlayed = seriesData.player1Wins + seriesData.player2Wins + seriesData.draws
            const gamesRemaining = config.value.gamesPerOpponent - gamesPlayed

            if (gamesRemaining === 0) {
                // All games played, determine winner by most wins
                if (seriesData.player1Wins > seriesData.player2Wins) {
                    seriesData.seriesWinner = seriesData.player1Id
                } else if (seriesData.player2Wins > seriesData.player1Wins) {
                    seriesData.seriesWinner = seriesData.player2Id
                } else {
                    seriesData.seriesWinner = 'draw'
                }
                seriesData.isComplete = true
            }
        } else {
            // Single game series - complete when game is played
            if (seriesGames.length > 0 && seriesGames[0].winner !== undefined) {
                seriesData.seriesWinner = seriesGames[0].winner
                seriesData.isComplete = true
            }
        }

        // Award points when series is completed
        if (seriesData.isComplete && seriesData.seriesWinner) {
            const player1 = players.value.find(p => p.id === seriesData.player1Id)
            const player2 = players.value.find(p => p.id === seriesData.player2Id)

            if (seriesData.seriesWinner === 'draw') {
                if (player1) player1.points += config.value.pointsPerDraw
                if (player2) player2.points += config.value.pointsPerDraw
            } else if (seriesData.seriesWinner === seriesData.player1Id) {
                if (player1) player1.points += config.value.pointsPerWin
                if (player2) player2.points += config.value.pointsPerLoss
            } else {
                if (player2) player2.points += config.value.pointsPerWin
                if (player1) player1.points += config.value.pointsPerLoss
            }
        }
    }

    // Actions
    function updateConfig(newConfig: Partial<TournamentConfig>) {
        config.value = { ...config.value, ...newConfig }
    }

    function addPlayer(name: string) {
        const id = `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        players.value.push({
            id,
            name: name.trim(),
            points: 0
        })
    }

    function removePlayer(playerId: string) {
        const index = players.value.findIndex(p => p.id === playerId)
        if (index > -1) {
            players.value.splice(index, 1)
        }
    }

    function updatePlayerName(playerId: string, newName: string) {
        const player = players.value.find(p => p.id === playerId)
        if (player) {
            player.name = newName.trim()
        }
    }

    function generateRoundRobinPairings() {
        games.value = []
        series.value = []
        const playerList = [...players.value]

        if (playerList.length < 2) return

        // If odd number of players, add a "bye" placeholder
        if (playerList.length % 2 === 1) {
            playerList.push({ id: 'bye', name: 'BYE', points: 0 })
        }

        const numPlayers = playerList.length
        const rounds = numPlayers - 1
        const gamesPerSeries = config.value.gamesPerOpponent
        const gamesNeededToWin = config.value.gamesPerOpponent > 1 ? Math.ceil(gamesPerSeries / 2) : 1

        for (let round = 1; round <= rounds; round++) {
            // Create pairings for this round
            for (let i = 0; i < numPlayers / 2; i++) {
                const player1Index = i
                const player2Index = numPlayers - 1 - i

                const player1 = playerList[player1Index]
                const player2 = playerList[player2Index]

                // Skip games involving the BYE player
                if (player1.id !== 'bye' && player2.id !== 'bye') {
                    const seriesId = `series-${round}-${i}`

                    // Create series
                    series.value.push({
                        id: seriesId,
                        player1Id: player1.id,
                        player2Id: player2.id,
                        round,
                        gamesNeededToWin,
                        player1Wins: 0,
                        player2Wins: 0,
                        draws: 0,
                        isComplete: false
                    })

                    // Create individual games for the series
                    for (let gameNum = 1; gameNum <= gamesPerSeries; gameNum++) {
                        const gameId = `game-${round}-${i}-${gameNum}`
                        games.value.push({
                            id: gameId,
                            player1Id: player1.id,
                            player2Id: player2.id,
                            round,
                            seriesId,
                            gameNumber: gameNum
                        })
                    }
                }
            }

            // Rotate players for next round (keep first player fixed)
            if (numPlayers > 2) {
                const last = playerList.pop()!
                playerList.splice(1, 0, last)
            }
        }
    }

    function generateSingleEliminationPairings() {
        games.value = []
        series.value = []

        if (players.value.length < 2) return

        // Create a bracket with all players for round 1
        let currentPlayers = [...players.value]

        // If odd number of players, add bye(s) to make it a power of 2
        const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(currentPlayers.length)))
        while (currentPlayers.length < nextPowerOf2) {
            currentPlayers.push({ id: `bye-${currentPlayers.length}`, name: 'BYE', points: 0 })
        }

        // Generate first round pairings
        const gamesPerSeries = config.value.gamesPerOpponent
        const gamesNeededToWin = config.value.gamesPerOpponent > 1 ? Math.ceil(gamesPerSeries / 2) : 1

        for (let i = 0; i < currentPlayers.length; i += 2) {
            const player1 = currentPlayers[i]
            const player2 = currentPlayers[i + 1]

            // Skip matchups with bye players - they auto-advance
            if (player1.id.startsWith('bye') || player2.id.startsWith('bye')) {
                continue
            }

            const seriesId = `series-1-${i / 2}`

            // Create series
            series.value.push({
                id: seriesId,
                player1Id: player1.id,
                player2Id: player2.id,
                round: 1,
                gamesNeededToWin,
                player1Wins: 0,
                player2Wins: 0,
                draws: 0,
                isComplete: false
            })

            // Create individual games for the series
            for (let gameNum = 1; gameNum <= gamesPerSeries; gameNum++) {
                const gameId = `game-1-${i / 2}-${gameNum}`
                games.value.push({
                    id: gameId,
                    player1Id: player1.id,
                    player2Id: player2.id,
                    round: 1,
                    seriesId,
                    gameNumber: gameNum
                })
            }
        }
    }

    function startTournament() {
        if (players.value.length < 2) {
            throw new Error('Need at least 2 players to start tournament')
        }

        console.log('Starting tournament with', players.value.length, 'players')

        // Generate pairings based on format
        if (config.value.format === 'round-robin') {
            generateRoundRobinPairings()
        } else if (config.value.format === 'single-elimination') {
            generateSingleEliminationPairings()
        }

        console.log('Generated', games.value.length, 'games')

        isSetupComplete.value = true
        tournamentStarted.value = true
        currentRound.value = 1

        console.log('Tournament started')

        // Start timer if configured
        if (config.value.roundTimerMinutes) {
            startRoundTimer()
        }

        // Return success to let the component handle navigation
        return true
    }

    function recordGameResult(gameId: string, winnerId: string) {
        const game = games.value.find(g => g.id === gameId)
        if (!game) return

        // Simply record the game result - don't award points here
        game.winner = winnerId

        // Update the series status which will handle points
        updateSeriesStatus(game.seriesId)
    }

    function recordGameDraw(gameId: string) {
        const game = games.value.find(g => g.id === gameId)
        if (!game) return

        // Record draw
        game.winner = 'draw'

        // Update the series status
        updateSeriesStatus(game.seriesId)
    }

    function clearGameResult(gameId: string) {
        const game = games.value.find(g => g.id === gameId)
        if (!game) return

        const seriesData = series.value.find(s => s.id === game.seriesId)
        if (!seriesData) return

        // If series was complete, remove the points
        if (seriesData.isComplete && seriesData.seriesWinner) {
            const player1 = players.value.find(p => p.id === seriesData.player1Id)
            const player2 = players.value.find(p => p.id === seriesData.player2Id)

            if (seriesData.seriesWinner === 'draw') {
                if (player1) player1.points -= config.value.pointsPerDraw
                if (player2) player2.points -= config.value.pointsPerDraw
            } else if (seriesData.seriesWinner === seriesData.player1Id) {
                if (player1) player1.points -= config.value.pointsPerWin
                if (player2) player2.points -= config.value.pointsPerLoss
            } else {
                if (player2) player2.points -= config.value.pointsPerWin
                if (player1) player1.points -= config.value.pointsPerLoss
            }
        }

        // Clear the game result
        game.winner = undefined

        // Reset series status
        seriesData.isComplete = false
        seriesData.seriesWinner = undefined

        // Recalculate series status
        updateSeriesStatus(game.seriesId)
    }

    function advanceToNextRound() {
        if (!canAdvanceRound.value) return

        if (currentRound.value < totalRounds.value) {
            currentRound.value++

            // For single elimination, generate the next round pairings
            if (config.value.format === 'single-elimination') {
                generateNextEliminationRound()
            }

            if (config.value.roundTimerMinutes) {
                startRoundTimer()
            }
        }
    }

    function startRoundTimer() {
        if (!config.value.roundTimerMinutes) return

        roundTimeRemaining.value = config.value.roundTimerMinutes * 60
        timerActive.value = true

        if (timerInterval) {
            clearInterval(timerInterval)
        }

        timerInterval = setInterval(() => {
            if (roundTimeRemaining.value > 0) {
                roundTimeRemaining.value--
            } else {
                stopRoundTimer()
            }
        }, 1000)
    }

    function stopRoundTimer() {
        timerActive.value = false
        if (timerInterval) {
            clearInterval(timerInterval)
            timerInterval = null
        }
    }

    function resetTournament() {
        config.value = {
            playerCount: 4,
            format: 'round-robin',
            gamesPerOpponent: 1,
            pointsPerWin: 3,
            pointsPerDraw: 1,
            pointsPerLoss: 0
        }
        players.value = []
        games.value = []
        series.value = []
        currentRound.value = 1
        isSetupComplete.value = false
        tournamentStarted.value = false
        stopRoundTimer()
        roundTimeRemaining.value = 0

        // Return success to let the component handle navigation
        return true
    }

    function generateNextEliminationRound() {
        if (config.value.format !== 'single-elimination') return
        if (!canAdvanceRound.value) return

        const nextRound = currentRound.value + 1
        if (nextRound > totalRounds.value) return

        // Get winners from current round
        const currentRoundWinners: string[] = []
        currentRoundSeries.value.forEach(series => {
            if (series.isComplete && series.seriesWinner && series.seriesWinner !== 'draw') {
                currentRoundWinners.push(series.seriesWinner)
            }
        })

        // Handle byes (players who didn't have a match this round)
        const currentRoundPlayers = new Set()
        currentRoundSeries.value.forEach(series => {
            currentRoundPlayers.add(series.player1Id)
            currentRoundPlayers.add(series.player2Id)
        })

        // Add players who had byes (didn't play this round)
        players.value.forEach(player => {
            if (!currentRoundPlayers.has(player.id)) {
                currentRoundWinners.push(player.id)
            }
        })

        if (currentRoundWinners.length < 2) return

        // Create pairings for next round
        const gamesPerSeries = config.value.gamesPerOpponent
        const gamesNeededToWin = config.value.gamesPerOpponent > 1 ? Math.ceil(gamesPerSeries / 2) : 1

        for (let i = 0; i < currentRoundWinners.length; i += 2) {
            if (i + 1 < currentRoundWinners.length) {
                const player1Id = currentRoundWinners[i]
                const player2Id = currentRoundWinners[i + 1]
                const seriesId = `series-${nextRound}-${i / 2}`

                // Create series
                series.value.push({
                    id: seriesId,
                    player1Id,
                    player2Id,
                    round: nextRound,
                    gamesNeededToWin,
                    player1Wins: 0,
                    player2Wins: 0,
                    draws: 0,
                    isComplete: false
                })

                // Create individual games for the series
                for (let gameNum = 1; gameNum <= gamesPerSeries; gameNum++) {
                    const gameId = `game-${nextRound}-${i / 2}-${gameNum}`
                    games.value.push({
                        id: gameId,
                        player1Id,
                        player2Id,
                        round: nextRound,
                        seriesId,
                        gameNumber: gameNum
                    })
                }
            }
        }
    }

    return {
        // State
        config,
        players,
        games,
        series,
        currentRound,
        isSetupComplete,
        tournamentStarted,
        roundTimeRemaining,
        timerActive,

        // Computed
        totalRounds,
        currentRoundGames,
        currentRoundSeries,
        canAdvanceRound,
        standings,
        isLastRound,
        tournamentComplete,

        // Actions
        updateConfig,
        addPlayer,
        removePlayer,
        updatePlayerName,
        startTournament,
        recordGameResult,
        recordGameDraw,
        clearGameResult,
        getSeriesGames,
        advanceToNextRound,
        startRoundTimer,
        stopRoundTimer,
        resetTournament,
        generateNextEliminationRound
    }
})