import request from '@/utils/request'

export function login(data) {
    // 这里先假设有一个登录接口
    return request.post('/auth/login', data)
}