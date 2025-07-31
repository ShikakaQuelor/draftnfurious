import { createRouter, createWebHistory } from 'vue-router'
import { useTournamentStore } from '../stores/tournament'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'setup',
      component: () => import('../components/TournamentSetup.vue'),
      meta: { title: 'Tournament Setup' }
    },
    {
      path: '/tournament',
      name: 'tournament',
      redirect: '/tournament/current-round',
      meta: { requiresTournament: true }
    },
    {
      path: '/tournament/current-round',
      name: 'current-round',
      component: () => import('../components/tournament/current-round/CurrentRound.vue'),
      meta: {
        title: 'Current Round',
        requiresTournament: true
      }
    },
    {
      path: '/tournament/overview',
      name: 'overview',
      component: () => import('../components/TournamentOverview.vue'),
      meta: {
        title: 'Tournament Overview',
        requiresTournament: true
      }
    }
  ],
})

// Navigation guard to protect tournament routes
router.beforeEach((to, from, next) => {
  const tournamentStore = useTournamentStore()

  if (to.meta.requiresTournament && !tournamentStore.tournamentStarted) {
    // Redirect to setup if trying to access tournament routes without an active tournament
    next({ name: 'setup' })
  } else {
    next()
  }
})

export default router
