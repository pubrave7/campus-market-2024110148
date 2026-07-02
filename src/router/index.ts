import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/trade',
      name: 'trade',
      component: () => import('@/views/TradeView.vue'),
    },
    {
      path: '/lost-found',
      name: 'lost-found',
      component: () => import('@/views/LostFoundView.vue'),
    },
    {
      path: '/group-buy',
      name: 'group-buy',
      component: () => import('@/views/GroupBuyView.vue'),
    },
    {
      path: '/errand',
      name: 'errand',
      component: () => import('@/views/ErrandView.vue'),
    },
    {
      path: '/publish',
      name: 'publish',
      component: () => import('@/views/PublishView.vue'),
    },
    {
      path: '/message',
      name: 'message',
      component: () => import('@/views/MessageView.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/UserCenterView.vue'),
    },
    // 保留原有通用页面路由以兼容已有功能
    {
      path: '/list',
      name: 'list',
      component: () => import('@/views/ListView.vue'),
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: () => import('@/views/DetailView.vue'),
    },
    {
      path: '/messages',
      redirect: '/message',
    },
    {
      path: '/profile',
      redirect: '/user',
    },
    {
      path: '/board',
      name: 'board',
      component: () => import('@/views/BoardView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
  ],
})

export default router
