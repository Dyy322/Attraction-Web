import request from '@/utils/request'

// 获取简介
export function getIntro() {
    return request.get('/intro')
}

// 更新简介
export function updateIntro(data) {
    return request.put('/intro', data)
}

// 获取活动
export function getActivity() {
    return request.get('/activity')
}

// 更新活动
export function updateActivity(data) {
    return request.put('/activity', data)
}