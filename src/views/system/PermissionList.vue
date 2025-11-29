<template>
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-6">🔒 权限列表清单</h2>

    <el-table :data="tableData" border height="500">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="module" label="所属模块" width="150">
        <template #default="{ row }">
          <el-tag>{{ row.module }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="权限名称" width="200" />
      <el-table-column prop="code" label="权限标识 (Code)" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPermissions } from '@/api/system'

const tableData = ref([])

onMounted(async () => {
  const res = await getPermissions()
  tableData.value = res.data || []
})
</script>