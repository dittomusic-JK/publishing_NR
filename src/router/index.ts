import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'neighbouring-rights',
      component: () => import('../views/NeighbouringRightsView.vue')
    }
  ]
})

export default router
