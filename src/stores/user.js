import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router' // 引入 router
import { login as loginApi, logout as logoutApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
    // 初始化时从 localStorage 读取 token，防止刷新丢失
    const token = ref(localStorage.getItem('admin_token') || '')
    const router = useRouter()

    // 登录动作
    const login = async (loginForm) => {
        try {
            const res = await loginApi(loginForm)

            // 🟢 关键修改：适配你的后端返回结构 { data: { token: ... } }
            // 如果 res.data 存在且有 token，取 res.data.token；兼容 Mock 直接返回 token 的情况
            const accessToken = res.data?.token || res.token

            if (accessToken) {
                token.value = accessToken
                localStorage.setItem('admin_token', accessToken)
                return Promise.resolve()
            } else {
                return Promise.reject(new Error('未获取到有效 Token'))
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    // 登出动作 (实现需求3：前端自主注销)
    const logout = async () => {
        try {
            // 尝试通知后端，但不管成功与否，前端都要执行清理
            await logoutApi().catch(() => {})
        } finally {
            // 🟢 强制清理前端状态
            token.value = ''
            localStorage.removeItem('admin_token')
            // 刷新或跳转回登录页由调用者或路由守卫处理
        }
    }

    return { token, login, logout }
})