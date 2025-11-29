<template>
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-6">🛡️ 角色管理</h2>

    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="角色代码" width="150" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="user_count" label="关联用户数" width="120" />
      <el-table-column label="操作" width="120">
        <template #default>
          <el-button link type="primary" disabled>系统内置</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRoles } from '@/api/system'

const tableData = ref([])

onMounted(async () => {
  const res = await getRoles()
  tableData.value = res.data || []
})
</script>