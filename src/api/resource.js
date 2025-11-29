import request from '@/utils/request'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// ==========================================
// 🔵 真实接口 (Real)
// ==========================================
const apiReal = {
    // POI
    getPois: (params) => request({ url: '/admin/spots', method: 'get', params }),
    getPoi: (id) => request({ url: `/admin/spots/${id}`, method: 'get' }),
    createPoi: (data) => request({ url: '/admin/spots', method: 'post', data }),
    updatePoi: (id, data) => request({ url: `/admin/spots/${id}`, method: 'put', data }),
    deletePoi: (id) => request({ url: `/admin/spots/${id}`, method: 'delete' }),

    // Merchant
    getMerchants: (params) => request({ url: '/admin/merchants', method: 'get', params }),
    getMerchant: (id) => request({ url: `/admin/merchants/${id}`, method: 'get' }),
    createMerchant: (data) => request({ url: '/admin/merchants', method: 'post', data }),
    updateMerchant: (id, data) => request({ url: `/admin/merchants/${id}`, method: 'put', data }),
    deleteMerchant: (id) => request({ url: `/admin/merchants/${id}`, method: 'delete' })
}

// ==========================================
// 🟡 模拟接口 (Mock)
// ==========================================
let mockStore = {
    pois: [
        { id: 1, name: '南昆山国家森林公园', address: '惠州市龙门县', lat: 23.6, lon: 114.2, description: '风景秀丽', images: [] },
        { id: 2, name: '罗浮山朱明洞', address: '惠州市博罗县', lat: 23.2, lon: 114.0, description: '道教名山', images: [] }
    ],
    merchants: [
        { id: 101, name: '云端民宿', type: 'hotel', contact: '13800000000', address: '南昆山镇', images: [] },
        { id: 102, name: '山水农庄', type: 'restaurant', contact: '0752-666666', address: '罗浮山脚', images: [] }
    ]
}

const apiMock = {
    // POI Mock
    getPois: () => Promise.resolve({ code: 200, data: { list: [...mockStore.pois], total: mockStore.pois.length } }),
    getPoi: (id) => {
        const item = mockStore.pois.find(i => i.id == id)
        return Promise.resolve({ code: 200, data: item })
    },
    createPoi: (data) => {
        const newItem = { id: Date.now(), ...data }
        mockStore.pois.push(newItem)
        return Promise.resolve({ code: 200, message: '创建成功' })
    },
    updatePoi: (id, data) => {
        const index = mockStore.pois.findIndex(i => i.id == id)
        if (index !== -1) mockStore.pois[index] = { ...mockStore.pois[index], ...data }
        return Promise.resolve({ code: 200, message: '更新成功' })
    },
    deletePoi: (id) => {
        mockStore.pois = mockStore.pois.filter(i => i.id != id)
        return Promise.resolve({ code: 200, message: '删除成功' })
    },

    // Merchant Mock (逻辑同上)
    getMerchants: () => Promise.resolve({ code: 200, data: { list: [...mockStore.merchants], total: mockStore.merchants.length } }),
    getMerchant: (id) => {
        const item = mockStore.merchants.find(i => i.id == id)
        return Promise.resolve({ code: 200, data: item })
    },
    createMerchant: (data) => {
        const newItem = { id: Date.now(), ...data }
        mockStore.merchants.push(newItem)
        return Promise.resolve({ code: 200, message: '创建成功' })
    },
    updateMerchant: (id, data) => {
        const index = mockStore.merchants.findIndex(i => i.id == id)
        if (index !== -1) mockStore.merchants[index] = { ...mockStore.merchants[index], ...data }
        return Promise.resolve({ code: 200, message: '更新成功' })
    },
    deleteMerchant: (id) => {
        mockStore.merchants = mockStore.merchants.filter(i => i.id != id)
        return Promise.resolve({ code: 200, message: '删除成功' })
    }
}

// ==========================================
// 🚀 导出
// ==========================================
export const getPois = USE_MOCK ? apiMock.getPois : apiReal.getPois
export const getPoi = USE_MOCK ? apiMock.getPoi : apiReal.getPoi
export const createPoi = USE_MOCK ? apiMock.createPoi : apiReal.createPoi
export const updatePoi = USE_MOCK ? apiMock.updatePoi : apiReal.updatePoi
export const deletePoi = USE_MOCK ? apiMock.deletePoi : apiReal.deletePoi

export const getMerchants = USE_MOCK ? apiMock.getMerchants : apiReal.getMerchants
export const getMerchant = USE_MOCK ? apiMock.getMerchant : apiReal.getMerchant
export const createMerchant = USE_MOCK ? apiMock.createMerchant : apiReal.createMerchant
export const updateMerchant = USE_MOCK ? apiMock.updateMerchant : apiReal.updateMerchant
export const deleteMerchant = USE_MOCK ? apiMock.deleteMerchant : apiReal.deleteMerchant