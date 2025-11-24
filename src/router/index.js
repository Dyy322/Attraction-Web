import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/Login.vue')
    },
    {
        path: '/',
        component: AppLayout,
        redirect: '/dashboard', // 默认跳去 dashboard
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/Dashboard.vue'),
                meta: { title: '数据概览' }
            },
            {
                path: 'intro',
                component: () => import('@/views/content/Intro.vue'),
                meta: { title: '简介管理' }
            },
            // 下面目前占位
            { path: 'poi', component: () => import('@/views/dashboard/Dashboard.vue') },
            { path: 'gifts', component: () => import('@/views/dashboard/Dashboard.vue') },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    // 如果去的是登录页，直接放行
    if (to.path === '/login') {
        next()
    } else {
        // 如果去的不是登录页，检查有没有 token
        if (token) {
            next() // 有票，进
        } else {
            next('/login') // 没票，踢回登录页
        }
    }
})

export default router