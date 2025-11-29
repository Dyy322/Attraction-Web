import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, logout as logoutApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
    const token = ref(localStorage.getItem('admin_token') || '')

    // 登录动作
    const login = async (loginForm) => {
        try {
            // 这里的 loginApi 会自动根据环境变量切换真假
            const res = await loginApi(loginForm)

            // 假设后端（或 Mock）返回结构包含 token 字段
            const accessToken = res.token

            token.value = accessToken
            localStorage.setItem('admin_token', accessToken)
            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
    }

    // 登出动作
    const logout = async () => {
        try {
            await logoutApi()
        } catch (e) {
            console.warn(e)
        } finally {
            token.value = ''
            localStorage.removeItem('admin_token')
        }
    }

    return { token, login, logout }
})