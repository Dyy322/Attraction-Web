<template>
  <div class="bg-white p-6 rounded shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">🏪 商家管理</h2>
      <el-button type="primary" @click="$router.push('/resource/merchant/add')">
        + 新增商家
      </el-button>
    </div>

    <el-table :data="tableData" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="商家名称" width="200" />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.type === 'hotel' ? 'success' : 'warning'">
            {{ scope.row.type === 'hotel' ? '住宿' : '餐饮' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="contact" label="联系电话" width="150" />
      <el-table-column prop="address" label="地址" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="$router.push(`/resource/merchant/edit/${scope.row.id}`)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMerchants, deleteMerchant } from '@/api/resource'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getMerchants()
    tableData.value = res.data.list || res.data || []
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除商家 "${row.name}" 吗？`, '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deleteMerchant(row.id)
    ElMessage.success('删除成功')
    fetchList()
  })
}

onMounted(fetchList)
</script>