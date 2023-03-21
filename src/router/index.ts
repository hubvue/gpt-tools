import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import CodeConvert from '../pages/Tools/CodeConvert/index.vue'

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
    },
    {
      path: '/code-convert',
      name: 'CodeConvert',
      component: CodeConvert,
      meta: {
        title: '代码转换器'
      },
      props: (route) => ({
        mode: route.query.mode
      })
    }
  ]
})

router.afterEach((to) => {
  const meta = (to.meta || {}) as { title: string}
  document.title = meta.title
})

export default router
