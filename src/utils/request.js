import axios from 'axios'
import { useUserStore } from '@/stores/user'

const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 10000
})

// Request 拦截器
service.interceptors.request.use(
    config => {
        const userStore = useUserStore()
        // 1. 注入管理端身份标识
        config.headers['X-Role'] = 'admin'
        // 2. 注入 Token
        if (userStore.token) {
            config.headers['Authorization'] = `Bearer ${userStore.token}`
        }
        return config
    },
    error => Promise.reject(error)
)

// Response 拦截器
service.interceptors.response.use(
    response => {
        // 直接返回 data 部分，方便调用
        return response.data
    },
    error => {
        // 处理 401 token 过期等通用错误
        if (error.response && error.response.status === 401) {
            const userStore = useUserStore()
            userStore.logout()
            location.reload()
        }
        return Promise.reject(error)
    }
)

export default service