import request from '@/utils/request'

// 读取开关
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// ==========================================
// 🔵 真实接口 (Real)
// ==========================================
const apiReal = {
    // 简介
    getIntro: () => request({ url: '/public/introduction', method: 'get' }),
    updateIntro: (data) => request({ url: '/intro', method: 'put', data }),

    // 活动
    getActivity: () => request({ url: '/activity', method: 'get' }),
    updateActivity: (data) => request({ url: '/activity', method: 'put', data }),

    // 热线
    getHotline: () => request({ url: '/hotline', method: 'get' }),
    updateHotline: (data) => request({ url: '/hotline', method: 'put', data })
}

// ==========================================
// 🟡 模拟接口 (Mock)
// ==========================================
// 模拟数据存储 (内存临时存储，刷新页面重置)
let mockData = {
    intro: {
        title: '双山引领区（Mock）',
        body_md: '# 欢迎来到双山\n\n这里是南昆山与罗浮山...',
        media_urls: ['https://placehold.co/600x400?text=View1', 'https://placehold.co/600x400?text=View2']
    },
    activity: {
        title: '2025登山节',
        content: '本次活动将于10月1日开始...'
    },
    hotline: {
        phone: '0752-12345678',
        service_time: '9:00 - 18:00'
    }
}

const apiMock = {
    getIntro: () => Promise.resolve({ code: 200, data: { ...mockData.intro } }),
    updateIntro: (data) => {
        mockData.intro = { ...mockData.intro, ...data }
        return Promise.resolve({ code: 200, message: '简介更新成功' })
    },

    getActivity: () => Promise.resolve({ code: 200, data: { ...mockData.activity } }),
    updateActivity: (data) => {
        mockData.activity = { ...mockData.activity, ...data }
        return Promise.resolve({ code: 200, message: '活动更新成功' })
    },

    getHotline: () => Promise.resolve({ code: 200, data: { ...mockData.hotline } }),
    updateHotline: (data) => {
        mockData.hotline = { ...mockData.hotline, ...data }
        return Promise.resolve({ code: 200, message: '热线更新成功' })
    }
}

// ==========================================
// 🚀 导出
// ==========================================
export const getIntro = USE_MOCK ? apiMock.getIntro : apiReal.getIntro
export const updateIntro = USE_MOCK ? apiMock.updateIntro : apiReal.updateIntro

export const getActivity = USE_MOCK ? apiMock.getActivity : apiReal.getActivity
export const updateActivity = USE_MOCK ? apiMock.updateActivity : apiReal.updateActivity

export const getHotline = USE_MOCK ? apiMock.getHotline : apiReal.getHotline
export const updateHotline = USE_MOCK ? apiMock.updateHotline : apiReal.updateHotline