import request from '@/utils/request'

// 获取所有用户
export function getUsers() {
    return request.get('/users');
}

// 获取用户详情
export function getUserDetail(id) {
    return request.get(`/users/${id}`);
}

// 获取用户活动记录
export function getUserActivity(id) {
    return request.get(`/users/${id}/activity`);
}