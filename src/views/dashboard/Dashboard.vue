<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-6 flex items-center">
        <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div>
          <div class="text-gray-500 text-sm">总用户数</div>
          <div class="text-2xl font-bold text-gray-800">{{ stats.total_users }}</div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 flex items-center">
        <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </div>
        <div>
          <div class="text-gray-500 text-sm">累计打卡</div>
          <div class="text-2xl font-bold text-gray-800">{{ stats.total_checkins }}</div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 flex items-center">
        <div class="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
        </div>
        <div>
          <div class="text-gray-500 text-sm">礼品兑换</div>
          <div class="text-2xl font-bold text-gray-800">{{ stats.total_redemptions }}</div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 flex items-center">
        <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
        </div>
        <div>
          <div class="text-gray-500 text-sm">待核销</div>
          <div class="text-2xl font-bold text-gray-800">{{ stats.pending_verifications }}</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded shadow">
        <h3 class="text-lg font-bold text-gray-700 mb-4">📊 游客与打卡趋势 (近7天)</h3>
        <div ref="trendChartRef" style="height: 350px;"></div>
      </div>

      <div class="bg-white p-6 rounded shadow">
        <h3 class="text-lg font-bold text-gray-700 mb-4">🚀 系统状态</h3>
        <div class="space-y-4">
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-600">系统版本</span>
            <span class="font-mono">v1.0.0 (Beta)</span>
          </div>
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-600">当前环境</span>
            <span v-if="isMock" class="text-yellow-600 font-bold">Mock 开发模式</span>
            <span v-else class="text-green-600 font-bold">Production</span>
          </div>
          <div class="flex justify-between border-b pb-2">
            <span class="text-gray-600">上次部署时间</span>
            <span class="text-gray-800">2023-11-28</span>
          </div>
          <div class="mt-6">
            <h4 class="text-sm font-bold text-gray-600 mb-2">快捷操作</h4>
            <div class="flex gap-2">
              <el-button size="small" @click="$router.push('/marketing/gifts')">上架礼品</el-button>
              <el-button size="small" @click="$router.push('/resource/poi')">管理景点</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import * as echarts from 'echarts'
import { getDashboardStats, getCheckinTrend } from '@/api/system'

const isMock = import.meta.env.VITE_USE_MOCK === 'true'
const stats = reactive({
  total_users: 0,
  total_checkins: 0,
  total_redemptions: 0,
  pending_verifications: 0
})

const trendChartRef = ref(null)

const initCharts = async () => {
  // 1. 获取数据
  const resTrend = await getCheckinTrend()
  const data = resTrend.data || {}

  // 2. 初始化图表
  const chart = echarts.init(trendChartRef.value)
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['打卡数', '新增用户'] },
    xAxis: {
      type: 'category',
      data: data.dates || []
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '打卡数',
        type: 'line',
        smooth: true,
        data: data.checkins || [],
        itemStyle: { color: '#10B981' } // Green
      },
      {
        name: '新增用户',
        type: 'bar',
        data: data.new_users || [],
        itemStyle: { color: '#3B82F6' } // Blue
      }
    ]
  }
  chart.setOption(option)

  // 响应式大小
  window.addEventListener('resize', () => chart.resize())
}

const fetchData = async () => {
  const res = await getDashboardStats()
  Object.assign(stats, res.data)
}

onMounted(() => {
  fetchData()
  initCharts()
})
</script>