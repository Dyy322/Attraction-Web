import request from '@/utils/request'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// ==========================================
// 🔵 真实接口 (Real)
// ==========================================
const apiReal = {
    // 系统权限
    getRoles: () => request({ url: '/users/roles', method: 'get' }),
    getPermissions: () => request({ url: '/users/permissions', method: 'get' }),

    // 统计 (假设后端补齐了这些接口)
    getDashboardStats: () => request({ url: '/admin/stats/overview', method: 'get' }),
    getCheckinTrend: () => request({ url: '/admin/stats/checkins', method: 'get' }),

    // 新增：用户列表
    getUsers: (params) => request({ url: '/admin/users', method: 'get', params })
}

// ==========================================
// 🟡 模拟数据 (Mock)
// ==========================================
const mockStore = {
    roles: [
        { id: 1, name: 'admin', description: '超级管理员，拥有所有权限', user_count: 2 },
        { id: 2, name: 'editor', description: '内容编辑，管理简介与POI', user_count: 5 },
        { id: 3, name: 'merchant', description: '商家账号，仅限核销操作', user_count: 12 }
    ],
    permissions: [
        { id: 101, code: 'poi:manage', name: '景点管理', module: '资源中心' },
        { id: 102, code: 'gift:manage', name: '礼品管理', module: '营销中心' },
        { id: 103, code: 'user:read', name: '用户查看', module: '系统管理' }
    ]
}

const apiMock = {
    getRoles: () => Promise.resolve({ code: 200, data: mockStore.roles }),
    getPermissions: () => Promise.resolve({ code: 200, data: mockStore.permissions }),

    // 模拟大屏数据
    getDashboardStats: () => Promise.resolve({
        code: 200,
        data: {
            total_users: 1205,
            total_checkins: 8540,
            total_redemptions: 320,
            pending_verifications: 15
        }
    }),
    getCheckinTrend: () => Promise.resolve({
        code: 200,
        data: {
            dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            checkins: [120, 132, 101, 134, 290, 530, 610], // 模拟周末高峰
            new_users: [20, 12, 11, 24, 90, 150, 130]
        }
    })
}

// ==========================================
// 🚀 导出
// ==========================================
export const getRoles = USE_MOCK ? apiMock.getRoles : apiReal.getRoles
export const getPermissions = USE_MOCK ? apiMock.getPermissions : apiReal.getPermissions
export const getDashboardStats = USE_MOCK ? apiMock.getDashboardStats : apiReal.getDashboardStats
export const getCheckinTrend = USE_MOCK ? apiMock.getCheckinTrend : apiReal.getCheckinTrend