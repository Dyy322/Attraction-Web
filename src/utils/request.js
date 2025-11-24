import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建实例
const service = axios.create({
    baseURL: '/api/v1', // 匹配 api.md 中的 Base URL
    timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 根据 API 文档，管理端必须带这个 Header
        config.headers['X-Role'] = 'admin'

        // 如果以后有 Token 逻辑，在这里加
        // const token = localStorage.getItem('token')
        // if (token) config.headers['Authorization'] = token

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        // 这里假设后端直接返回数据，视具体情况解构
        return response.data
    },
    (error) => {
        // 统一错误提示
        const msg = error.response?.data?.message || error.message || '请求失败'
        ElMessage.error(msg)
        return Promise.reject(error)
    }
)

export default service