import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import SolitaireView from '../views/SolitaireView.vue'
import YahtzeeView from '../views/YahtzeeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SolitaireView, // HomeView,
    },
    {
      path: '/solitaire',
      name: 'solitaire',
      component: SolitaireView,
    },
    {
      path: '/yahtzee',
      name: 'yahtzee',
      component: YahtzeeView
    },
  ]
})

export default router
