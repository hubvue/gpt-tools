import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'GPT Tools'
      }
    }
  ]
})

router.afterEach((to) => {
  const meta = (to.meta || {}) as { title: string}
  document.title = meta.title
})

export default router
