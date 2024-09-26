import { createRouter, createWebHistory } from "vue-router"
import Home from '@/views/home.vue'
import view from "@/views/view.vue"

//创建路由器
const router = createRouter({
  history: createWebHistory(),
  routes:[
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        KeepAlive: true
      }
    },
    {
      path: '/view',
      name: 'view',
      component: view,
    }
  ]
})

export default router

