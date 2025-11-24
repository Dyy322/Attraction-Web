import request from '@/utils/request'

// --- POI 景点 ---
export function getPois(params) {
    return request.get('/admin/pois', { params })
}
export function createPoi(data) {
    return request.post('/admin/pois', data)
}
export function updatePoi(id, data) {
    return request.put(`/admin/pois/${id}`, data)
}
export function deletePoi(id) {
    return request.delete(`/admin/pois/${id}`)
}

// --- 礼品 ---
export function getGifts(params) {
    return request.get('/admin/gifts', { params })
}