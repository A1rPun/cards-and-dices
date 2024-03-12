import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/solitaire',
      name: 'solitaire',
      component: () => import('../views/SolitaireView.vue')
    },
    {
      path: '/yahtzee',
      name: 'yahtzee',
      component: () => import('../views/YahtzeeView.vue')
    },
  ]
})

export default router
