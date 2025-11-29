import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 简单的布局外壳 (如果你的 src/layout/AppLayout.vue 还没写，可以先用这个)
import AppLayout from '@/layout/AppLayout.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login/Login.vue')
        },
        {
            path: '/',
            component: AppLayout,
            redirect: '/dashboard',
            // 需要登录才能访问的路由
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/dashboard/Dashboard.vue'),
                    meta: { title: '首页' }
                },
                // --- 模块一：内容管理 ---
                {
                    path: 'content/intro',
                    name: 'intro',
                    component: () => import('@/views/content/Intro.vue'),
                    meta: { title: '简介管理' }
                },
                {
                    path: 'content/activity',
                    name: 'activity',
                    component: () => import('@/views/content/Activity.vue'),
                    meta: { title: '活动与热线' }
                },
                {
                    path: 'resource/poi',
                    name: 'poi-list',
                    component: () => import('@/views/poi/PoiList.vue'),
                    meta: { title: '景点管理' }
                },
                {
                    path: 'resource/poi/add',
                    name: 'poi-add',
                    component: () => import('@/views/poi/PoiForm.vue'),
                    meta: { title: '新增景点' }
                },
                {
                    path: 'resource/poi/edit/:id',
                    name: 'poi-edit',
                    component: () => import('@/views/poi/PoiForm.vue'),
                    meta: { title: '编辑景点' }
                },
                {
                    path: 'resource/merchant',
                    name: 'merchant-list',
                    component: () => import('@/views/merchant/MerchantList.vue'),
                    meta: { title: '商家管理' }
                },
                {
                    path: 'resource/merchant/add',
                    name: 'merchant-add',
                    component: () => import('@/views/merchant/MerchantForm.vue'),
                    meta: { title: '新增商家' }
                },
                {
                    path: 'resource/merchant/edit/:id',
                    name: 'merchant-edit',
                    component: () => import('@/views/merchant/MerchantForm.vue'),
                    meta: { title: '编辑商家' }
                },{
                    path: 'marketing/gifts',
                    name: 'gift-list',
                    component: () => import('@/views/gift/GiftList.vue'),
                    meta: { title: '礼品库' }
                },
                {
                    path: 'marketing/suppliers',
                    name: 'supplier-list',
                    component: () => import('@/views/gift/SupplierList.vue'),
                    meta: { title: '供应商管理' }
                },
                {
                    path: 'marketing/rules',
                    name: 'points-rules',
                    component: () => import('@/views/points/Rules.vue'),
                    meta: { title: '积分规则' }
                },// 系统管理
                {
                    path: 'system/roles',
                    name: 'roles',
                    component: () => import('@/views/system/RoleList.vue'),
                    meta: { title: '角色管理' }
                },
                {
                    path: 'system/permissions',
                    name: 'permissions',
                    component: () => import('@/views/system/PermissionList.vue'),
                    meta: { title: '权限列表' }
                }
            ]
        }
    ]
})

// 路由守卫：检查 Token
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    if (to.path !== '/login' && !userStore.token) {
        next('/login')
    } else {
        next()
    }
})

export default router