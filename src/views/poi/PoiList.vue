<template>
  <div class="bg-white p-6 rounded shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">🏔️ 景点列表</h2>
      <el-button type="primary" @click="$router.push('/resource/poi/add')">
        + 新增景点
      </el-button>
    </div>

    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="景点名称" width="200" />
      <el-table-column label="位置坐标">
        <template #default="scope">
          {{ scope.row.lat }}, {{ scope.row.lon }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址描述" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="$router.push(`/resource/poi/edit/${scope.row.id}`)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPois, deletePoi } from '@/api/resource'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getPois()
    // 兼容 mock ({data: {list: []}}) 和部分后端直接返回数组的情况
    tableData.value = res.data.list || res.data || []
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除 "${row.name}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deletePoi(row.id)
    ElMessage.success('删除成功')
    fetchList()
  })
}

onMounted(fetchList)
</script>