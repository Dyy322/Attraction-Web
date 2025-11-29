import request from '@/utils/request'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// ==========================================
// 🔵 真实接口 (Real)
// ==========================================
const apiReal = {
    // 供应商
    getSuppliers: () => request({ url: '/admin/suppliers', method: 'get' }),
    createSupplier: (data) => request({ url: '/admin/suppliers', method: 'post', data }),

    // 礼品
    getGifts: (params) => request({ url: '/prize/list', method: 'get', params }),
    createGift: (data) => request({ url: '/admin/gifts', method: 'post', data }),
    updateGift: (id, data) => request({ url: `/admin/gifts/${id}`, method: 'put', data }),
    deleteGift: (id) => request({ url: `/admin/gifts/${id}`, method: 'delete' }),

    // 积分规则
    getRules: () => request({ url: '/admin/points-rules', method: 'get' }),
    updateRule: (id, data) => request({ url: `/admin/points-rules/${id}`, method: 'put', data }),

    // 新增：核销与积分调整
    verifyPrize: (code) => request({ url: `/admin/verifyPrize/${code}`, method: 'post' }),
    adjustPoints: (data) => request({ url: '/admin/adjustPoints', method: 'post', data })
}

// ==========================================
// 🟡 模拟数据存储 (Mock Store)
// ==========================================
let mockData = {
    suppliers: [
        { id: 1, name: '南昆山特产总汇', contact: '张三 13800138000' },
        { id: 2, name: '罗浮山文创店', contact: '李四 13900139000' }
    ],
    gifts: [
        { id: 101, name: '景区定制钥匙扣', points: 100, stock: 500, supplier_id: 1, image: '' },
        { id: 102, name: '罗浮山红茶礼盒', points: 1000, stock: 50, supplier_id: 2, image: '' }
    ],
    rules: [
        { id: 1, code: 'checkin_base', name: '景点打卡基础分', points: 10, description: '每次打卡获得的基础积分' },
        { id: 2, code: 'review_text', name: '发表文字点评', points: 5, description: '发表有效评论获得的积分' },
        { id: 3, code: 'review_image', name: '发表带图点评', points: 10, description: '评论包含图片额外奖励' }
    ]
}

// ==========================================
// 🟡 模拟接口实现 (Mock Impl)
// ==========================================
const apiMock = {
    // 供应商
    getSuppliers: () => Promise.resolve({ code: 200, data: [...mockData.suppliers] }),
    createSupplier: (data) => {
        mockData.suppliers.push({ id: Date.now(), ...data })
        return Promise.resolve({ code: 200, message: '添加成功' })
    },

    // 礼品
    getGifts: () => Promise.resolve({ code: 200, data: { list: [...mockData.gifts], total: mockData.gifts.length } }),
    createGift: (data) => {
        mockData.gifts.push({ id: Date.now(), ...data })
        return Promise.resolve({ code: 200, message: '创建成功' })
    },
    updateGift: (id, data) => {
        const idx = mockData.gifts.findIndex(g => g.id == id)
        if (idx !== -1) mockData.gifts[idx] = { ...mockData.gifts[idx], ...data }
        return Promise.resolve({ code: 200, message: '更新成功' })
    },
    deleteGift: (id) => {
        mockData.gifts = mockData.gifts.filter(g => g.id != id)
        return Promise.resolve({ code: 200, message: '删除成功' })
    },

    // 规则
    getRules: () => Promise.resolve({ code: 200, data: [...mockData.rules] }),
    updateRule: (id, data) => {
        const idx = mockData.rules.findIndex(r => r.id == id)
        if (idx !== -1) mockData.rules[idx] = { ...mockData.rules[idx], ...data }
        return Promise.resolve({ code: 200, message: '规则更新成功' })
    }
}

// ==========================================
// 🚀 导出
// ==========================================
export const getSuppliers = USE_MOCK ? apiMock.getSuppliers : apiReal.getSuppliers
export const createSupplier = USE_MOCK ? apiMock.createSupplier : apiReal.createSupplier

export const getGifts = USE_MOCK ? apiMock.getGifts : apiReal.getGifts
export const createGift = USE_MOCK ? apiMock.createGift : apiReal.createGift
export const updateGift = USE_MOCK ? apiMock.updateGift : apiReal.updateGift
export const deleteGift = USE_MOCK ? apiMock.deleteGift : apiReal.deleteGift

export const getRules = USE_MOCK ? apiMock.getRules : apiReal.getRules
export const updateRule = USE_MOCK ? apiMock.updateRule : apiReal.updateRule