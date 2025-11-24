import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
    const token = ref(localStorage.getItem('token') || '')
    const role = ref('admin')
    const router = useRouter()

    // 登录动作
    function login(username, password) {
        // 真实场景：调用 API
        // return loginApi({ username, password }).then(res => { ... })

        // --- 模拟场景 (因为还没对接后端) ---
        return new Promise((resolve) => {
            if (username === 'admin' && password === '123456') {
                token.value = 'mock-token-123456'
                localStorage.setItem('token', token.value)
                resolve(true)
            } else {
                resolve(false)
            }
        })
    }

    // 退出动作
    function logout() {
        token.value = ''
        localStorage.removeItem('token')
        // 强制刷新或跳转
        window.location.href = '/login'
    }

    return { token, role, login, logout }
})