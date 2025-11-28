<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, User, Phone, Calendar, Clock, Trophy, Location } from "@element-plus/icons-vue"
import { getUserDetail, getUserActivity } from "@/api/user.js";

const route = useRoute()
const router = useRouter()
const userId = route.params.id

// 用户详情数据
const userDetail = ref({
  id: userId,
  username: '',
  nickname: '',
  avatar_url: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  phone: '',
  totalPoints: 0,
  checkinCount: 0,
  createdAt: '',
  updatedAt: '',
  status: true
})

// 判断用户是否活跃
function isUserActive(updatedAt, activeDays = 1) {
  if (!updatedAt) {
    return false;
  }

  const lastLogin = new Date(updatedAt);
  const currentTime = new Date();
  const timeDiff = currentTime - lastLogin;
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

  return daysDiff <= activeDays;
}

// 模拟用户活动记录，兑换奖品只是模拟可不实现
const activityLogs = ref([
  { id: 1, type: 'checkin', location: '双山景区大门', points: 10, time: '2024-01-15 10:30:00' },
  { id: 2, type: 'checkin', location: '双山观景台', points: 15, time: '2024-01-15 14:20:00' },
  { id: 3, type: 'redeem', item: '景区纪念品', points: -50, time: '2024-01-14 16:45:00' },
  { id: 4, type: 'checkin', location: '双山瀑布', points: 20, time: '2024-01-13 11:15:00' },
  { id: 5, type: 'redeem', item: '电影票', points: -30, time: '2024-01-12 18:30:00' },
  { id: 6, type: 'checkin', location: '双山瀑布', points: 20, time: '2024-01-12 11:30:00' },
  { id: 7, type: 'redeem', item: '电影票', points: -30, time: '2024-01-11 18:30:00' },
])

// 联调时修改
// getUserActivity(userId).then(res => {
//   activityLogs.value = res.data
// })

// 加载用户详情
const loadUserDetail = async () => {
  try {
    // 模拟API调用，联调时修改
    const mockData = {
      id: userId,
      username: `user${userId}`,
      nickname: `用户${userId}`,
      phone: '13800138000',
      totalPoints: 150,
      checkinCount: 8,
      createdAt: '2024-01-01 10:00:00',
      updatedAt: '2024-01-15 16:30:00',
      status: 'true'
    }
    userDetail.value = { ...userDetail.value, ...mockData }
  } catch (error) {
    ElMessage.error('加载用户详情失败')
  }
}

onMounted(() => {
  loadUserDetail()
})
</script>

<template>
  <div class="user-detail-page">
    <!-- 头部导航 -->
    <div class="page-header">
      <el-button class="back-btn" type="primary" link @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回用户列表
      </el-button>
    </div>

    <div class="content-grid">
      <!-- 左侧用户信息卡片 -->
      <div class="sidebar-section">
        <el-card class="user-profile-card" shadow="hover">
          <div class="profile-header">
            <div class="avatar-container">
              <el-avatar :size="100" :src="userDetail.avatar_url" class="profile-avatar" />
              <div class="status-badge" :class="userDetail.status === 'true' ? 'active' : 'inactive'"></div>
            </div>
            <div class="profile-info">
              <h2 class="user-name">{{ userDetail.nickname }}</h2>
              <p class="user-id">ID: {{ userDetail.username }}</p>
              <el-tag class="status-tag" :type="userDetail.status === 'true' ? 'success' : 'info'">
                {{ userDetail.status === 'true' ? '活跃用户' : '非活跃用户' }}
              </el-tag>
            </div>
          </div>

          <div class="profile-stats">
            <div class="stat-item">
              <div class="stat-icon points">
                <el-icon><Trophy /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ userDetail.totalPoints }}</div>
                <div class="stat-label">总积分</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon checkins">
                <el-icon><Location /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ userDetail.checkinCount }}</div>
                <div class="stat-label">打卡次数</div>
              </div>
            </div>
          </div>

          <div class="profile-details">
            <div class="detail-item">
              <el-icon><Phone /></el-icon>
              <span class="detail-label">手机号</span>
              <span class="detail-value">{{ userDetail.phone }}</span>
            </div>
            <div class="detail-item">
              <el-icon><Calendar /></el-icon>
              <span class="detail-label">注册时间</span>
              <span class="detail-value">{{ userDetail.createdAt }}</span>
            </div>
            <div class="detail-item">
              <el-icon><Clock /></el-icon>
              <span class="detail-label">最后登录</span>
              <span class="detail-value">{{ userDetail.updatedAt }}</span>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 右侧主要内容 -->
      <div class="main-section">
        <!-- 活动记录卡片 -->
        <el-card class="activity-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3 class="card-title">活动记录</h3>
              <span class="card-subtitle">最近用户活动</span>
            </div>
          </template>

          <el-table
              :data="activityLogs"
              class="activity-table"
              :row-class-name="() => 'activity-row'"
              max-height="280"
          >
            <el-table-column prop="time" label="时间" width="180">
              <template #default="{ row }">
                <div class="time-cell">{{ row.time }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="120">
              <template #default="{ row }">
                <el-tag class="type-tag" :type="row.type === 'checkin' ? 'success' : 'warning'">
                  {{ row.type === 'checkin' ? '打卡' : '兑换' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="location" label="地点/物品" min-width="200">
              <template #default="{ row }">
                <div class="location-cell">
                  <el-icon><Location /></el-icon>
                  {{ row.location || row.item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="points" label="积分变化" width="120">
              <template #default="{ row }">
                <span class="points-change" :class="row.points > 0 ? 'positive' : 'negative'">
                  {{ row.points > 0 ? '+' : '' }}{{ row.points }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 统计信息卡片 -->
        <el-card class="stats-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3 class="card-title">统计概览</h3>
              <span class="card-subtitle">用户数据统计</span>
            </div>
          </template>
          <div class="stats-grid">
            <div class="stat-card checkin-stat">
              <div class="stat-icon-wrapper">
                <el-icon><Location /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ userDetail.checkinCount }}</div>
                <div class="stat-label">总打卡次数</div>
              </div>
            </div>
            <div class="stat-card points-stat">
              <div class="stat-icon-wrapper">
                <el-icon><Trophy /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ userDetail.totalPoints }}</div>
                <div class="stat-label">当前积分</div>
              </div>
            </div>
            <div class="stat-card activity-stat">
              <div class="stat-icon-wrapper">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ activityLogs.length }}</div>
                <div class="stat-label">活动记录</div>
              </div>
            </div>

          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-detail-page {
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

/* 页面头部样式 */
.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  background: white;
  padding: 12px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.back-btn {
  margin-right: 24px;
  color: #667eea;
  font-weight: 500;
}

/* 内容网格布局 */
.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 1024px) {
  .content-grid {
    grid-template-columns: 400px 1fr;
  }
}

/* 侧边栏样式 */
.sidebar-section {
  position: sticky;
  top: 24px;
  height: fit-content;
}

.user-profile-card {
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.user-profile-card:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

.profile-header {
  text-align: center;
  padding: 24px 0;
  border-bottom: 1px solid #e2e8f0;
}

.avatar-container {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-badge.active {
  background: #10b981;
}

.status-badge.inactive {
  background: #6b7280;
}

.profile-info {
  margin-top: 16px;
}

.user-name {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.user-id {
  color: #718096;
  font-size: 14px;
  margin: 0 0 12px 0;
}

.status-tag {
  font-weight: 600;
  padding: 4px 12px;
}

/* 统计信息样式 */
.profile-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.stat-icon.points {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.checkins {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 12px;
  color: #718096;
}

/* 详细信息样式 */
.profile-details {
  padding: 24px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f7fafc;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .el-icon {
  color: #667eea;
  font-size: 18px;
}

.detail-label {
  flex: 1;
  color: #718096;
  font-size: 14px;
}

.detail-value {
  color: #2d3748;
  font-weight: 500;
}

/* 主要内容区域样式 */
.main-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.activity-card,
.stats-card {
  border: none;
  border-radius: 16px;
  background: white;
}

.page-header:hover,
.activity-card:hover,
.stats-card:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.card-subtitle {
  color: #718096;
  font-size: 14px;
}

/* 活动表格样式 */
.activity-table {
  border: none;
}

.activity-table :deep(.el-table__header) {
  background: #f8fafc;
}

.activity-table :deep(.el-table__row) {
  transition: all 0.2s ease;
}

.activity-table :deep(.el-table__row:hover) {
  background: #f7fafc;
  transform: scale(1.01);
}

.time-cell {
  color: #718096;
  font-size: 13px;
}

.type-tag {
  font-weight: 600;
  padding: 4px 8px;
}

.location-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
}

.location-cell .el-icon {
  color: #667eea;
}

.points-change {
  font-weight: 600;
  font-size: 14px;
}

.points-change.positive {
  color: #10b981;
}

.points-change.negative {
  color: #ef4444;
}

/* 统计卡片样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.checkin-stat .stat-icon-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.points-stat .stat-icon-wrapper {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.activity-stat .stat-icon-wrapper {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.duration-stat .stat-icon-wrapper {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
}

.stat-label {
  color: #718096;
  font-size: 14px;
  margin-top: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .back-btn {
    margin-right: 0;
  }

  .profile-stats {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
