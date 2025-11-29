import request from '@/utils/request'

// 1. 读取开关
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// ==========================================
// 🔵 真实接口实现 (Real Implementation)
// ==========================================
const loginReal = (data) => {
    return request({
        url: '/auth/adminLogin', // 修正为后端实际接口
        method: 'post',
        data
    })
}

// ==========================================
// 🟡 模拟接口实现 (Mock Implementation)
// ==========================================
const loginMock = (data) => {
    return new Promise((resolve) => {
        console.log('🟡 [Mock模式] 模拟登录接口被调用，参数:', data)

        setTimeout(() => {
            // 模拟后端返回的数据结构
            resolve({
                code: 200,
                message: '登录成功 (Mock)',
                // 生成一个随机 Token
                token: 'mock-token-' + Date.now()
            })
        }, 800) // 模拟 800ms 网络延迟
    })
}

// ==========================================
// 🚀 导出逻辑 (The Switch)
// ==========================================
// 外部调用 import { login } from ... 时，会自动拿到对应的版本
export const login = USE_MOCK ? loginMock : loginReal

// 其他接口同理，比如登出
export const logout = USE_MOCK
    ? () => Promise.resolve({ code: 200 })
    : () => request({ url: '/auth/logout', method: 'post' })