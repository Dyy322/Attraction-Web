<!-- 在src/views/user/Users.vue中替换整个文件内容 -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {Clock, Delete, Location, Phone, Refresh, Search, Star, View} from "@element-plus/icons-vue";
import { getUsers } from '@/api/user.js'

const router = useRouter()

// 搜索条件
const searchForm = ref({
  nickname: '',
  phone: '',
  status: ''
})

// 分页信息
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 用户列表数据
const userList = ref([])
const loading = ref(false)
// 所显示用户列表
const displayUserList = ref([])

// 模拟用户数据
const mockUsers = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  username: `user${i + 1}`,
  nickname: `用户${i + 1}`,
  avatar_url: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  phone: `13800138${String(i).padStart(3, '0')}`,
  totalPoints: Math.floor(Math.random() * 500) + 50,
  checkinCount: Math.floor(Math.random() * 20) + 1,
  createdAt: `2024-01-${String(Math.floor(i / 2) + 1).padStart(2, '0')} 10:00:00`,
  status: 1
}))

userList.value = mockUsers
// 联调时修改
// getUsers().then(res => {
//   userList.value = res.data
// })
displayUserList.value = userList.value.map(user => ({
  ...user,
  isActive: isUserActive(user.updatedAt)
}))

// 判断用户是否活跃
function isUserActive(updatedAt, activeDays = 1) {
  if (!updatedAt) {
    return 0;
  }

  const lastLogin = new Date(updatedAt);
  const currentTime = new Date();
  const timeDiff = currentTime - lastLogin;
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

  return daysDiff <= activeDays ? 1 : 0;
}

// 加载用户列表
const loadUsers = async () => {
  loading.value = true
  try {
    // 搜索过滤
    let filteredUsers = userList.value.filter(user => {
      const matchesNickname = !searchForm.value.nickname ||
          user.nickname.includes(searchForm.value.nickname)
      const matchesPhone = !searchForm.value.phone ||
          user.phone.includes(searchForm.value.phone)
      const matchesStatus = !searchForm.value.status ||
          user.status.toString() === searchForm.value.status

      return matchesNickname && matchesPhone && matchesStatus
    })

    // 分页
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    displayUserList.value = filteredUsers.slice(start, end)
    pagination.value.total = filteredUsers.length

  } catch (error) {
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索用户
const handleSearch = () => {
  pagination.value.currentPage = 1
  loadUsers()
}

// 重置搜索
const handleReset = () => {
  searchForm.value = { nickname: '', phone: '', status: '' }
  pagination.value.currentPage = 1
  loadUsers()
}

// 查看用户详情
const viewUserDetail = (userId) => {
  router.push(`/system/users/${userId}`)
}

// 分页变化
const handlePageChange = (page) => {
  pagination.value.currentPage = page
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="users-page">
<!--    &lt;!&ndash; 页面标题 &ndash;&gt;-->
<!--    <div class="page-header">-->
<!--      <h1 class="page-title">👥 用户管理</h1>-->
<!--      <p class="page-subtitle">管理平台用户信息，查看用户详情和活动记录</p>-->
<!--    </div>-->

    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-icon">🔍</div>
          <span class="header-title">用户搜索</span>
        </div>
      </template>

      <div style="padding: 8px 0">
        <el-form :model="searchForm">
          <div class="form-row">
            <el-form-item label="用户昵称">
              <el-input
                  v-model="searchForm.nickname"
                  placeholder="请输入用户昵称"
                  clearable
                  prefix-icon="User"
              />
            </el-form-item>

            <el-form-item label="手机号">
              <el-input
                  v-model="searchForm.phone"
                  placeholder="请输入手机号"
                  clearable
                  prefix-icon="Phone"
              />
            </el-form-item>

            <el-form-item label="状态">
              <el-select
                  v-model="searchForm.status"
                  placeholder="请选择状态"
                  clearable
                  style="width: 150px"
              >
                <el-option label="活跃" value="1" />
                <el-option label="非活跃" value="0" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <div class="buttons">
                <el-button
                    type="primary"
                    @click="handleSearch"
                    class="search-btn"
                >
                  <el-icon><Search /></el-icon>
                  搜索
                </el-button>
                <el-button
                    @click="handleReset"
                    class="reset-btn"
                >
                  <el-icon><Refresh /></el-icon>
                  重置
                </el-button>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="list-card" shadow="hover">
      <template #header>
        <div class="list-header">
          <div class="header-left">
            <div class="header-icon">📋</div>
            <span class="header-title">用户列表</span>
          </div>
          <div class="header-right">
            <span class="user-count">
              共 <span class="count-number">{{ pagination.total }}</span> 个用户
            </span>
          </div>
        </div>
      </template>

      <el-table
          :data="displayUserList"
          v-loading="loading"
          class="custom-table"
          @row-dblclick="(row) => viewUserDetail(row.id)"
          stripe
          max-height="600"
      >
        <el-table-column label="用户信息" min-width="220">
          <template #default="{ row }">
            <div class="user-info-cell">
              <el-avatar
                  :size="44"
                  :src="row.avatar_url"
                  class="user-avatar"
                  shape="square"
              />
              <div class="user-details">
                <div class="user-nickname">{{ row.nickname }}</div>
                <div class="user-username">@{{ row.username }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="手机号" width="140">
          <template #default="{ row }">
            <div class="phone-cell">
              <el-icon><Phone /></el-icon>
              {{ row.phone }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="累计打卡" width="120">
          <template #default="{ row }">
            <el-tag
                type="success"
                class="checkin-tag"
                effect="light"
            >
              <el-icon><Location /></el-icon>
              {{ row.checkinCount }} 次
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="总积分" width="120">
          <template #default="{ row }">
            <div class="points-cell">
              <el-icon><Star /></el-icon>
              <span class="points-value">{{ row.totalPoints }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="注册时间" width="180">
          <template #default="{ row }">
            <div class="time-cell">
              <el-icon><Clock /></el-icon>
              {{ row.createdAt }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag
                :type="row.status === 1 ? 'success' : 'info'"
                class="status-tag"
                effect="light"
            >
              {{ row.status === 1 ? '活跃' : '非活跃' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons-cell">
              <el-button
                  type="primary"
                  size="small"
                  @click.stop="viewUserDetail(row.id)"
                  class="detail-btn"
              >
                <el-icon><View /></el-icon>
                详情
              </el-button>
<!--              <el-button-->
<!--                  type="danger"-->
<!--                  size="small"-->
<!--                  @click.stop="deleteUser(row.id)"-->
<!--                  class="delete-btn"-->
<!--              >-->
<!--                <el-icon><Delete /></el-icon>-->
<!--                删除-->
<!--              </el-button>-->
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="sizes, prev, pager, next, jumper"
            @size-change="loadUsers"
            @current-change="handlePageChange"
            class="custom-pagination"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.users-page {
  min-height: calc(100vh - 120px);
  padding: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 卡片样式，一起定义 */
.search-card,
.list-card {
  border: none;
  border-radius: 12px;
  margin-bottom: 24px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 1.5rem;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 0;
  align-items: end;
}

.buttons {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-left: 50px;
}

.reset-btn {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.reset-btn {
  border: 1px solid #e2e8f0;
  color: #4a5568;
}

.reset-btn:hover {
  border-color: #4299e1;
  color: #4299e1;
}

/* 列表头部样式 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-count {
  color: #718096;
  font-size: 0.95rem;
}

.count-number {
  font-weight: 600;
  color: #4299e1;
  font-size: 1.1rem;
}

/* 表格样式 */
.custom-table {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.custom-table :deep(.el-table__header) {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
}

.custom-table :deep(.el-table__header th) {
  background: transparent;
  color: #2d3748;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
}

.custom-table :deep(.el-table__row) {
  transition: all 0.3s ease;
  cursor: pointer;
}

.custom-table :deep(.el-table__row:hover) {
  background: linear-gradient(135deg, #ebf4ff 0%, #e6fffa 100%) !important;
  transform: scale(1.005);
}

.custom-table :deep(.el-table__row.el-table__row--striped) {
  background: #fafafa;
}

.custom-table :deep(.el-table__row.el-table__row--striped:hover) {
  background: linear-gradient(135deg, #f0fff4 0%, #f0f9ff 100%) !important;
}

/* 单元格样式 */
.user-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.user-avatar {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-nickname {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 2px;
}

.user-username {
  font-size: 0.85rem;
  color: #718096;
}

.phone-cell,
.time-cell,
.points-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4a5568;
}

.points-value {
  font-weight: 600;
  color: #ed8936;
}

.checkin-tag,
.status-tag {
  border: none;
  border-radius: 6px;
  font-weight: 500;
}

.action-buttons-cell {
  display: flex;
  gap: 8px;
}

.detail-btn,
.delete-btn {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.detail-btn {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  border: none;
}

.detail-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.delete-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
}

/* 分页样式 */
.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.custom-pagination {
  padding: 16px;
  border-radius: 8px;
  background: #f7fafc;
}
</style>