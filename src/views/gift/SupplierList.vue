<template>
  <div class="bg-white p-6 rounded shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">🏭 供应商管理</h2>
      <el-button type="primary" @click="dialogVisible = true">+ 添加供应商</el-button>
    </div>

    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="供应商名称" />
      <el-table-column prop="contact" label="联系人/电话" />
    </el-table>

    <el-dialog v-model="dialogVisible" title="添加供应商" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="form.name" placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.contact" placeholder="例如：张经理 13800000000" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getSuppliers, createSupplier } from '@/api/marketing'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const dialogVisible = ref(false)
const form = reactive({ name: '', contact: '' })

const fetchList = async () => {
  const res = await getSuppliers()
  tableData.value = res.data || []
}

const handleSubmit = async () => {
  if (!form.name) return ElMessage.warning('请输入名称')
  await createSupplier({ ...form })
  ElMessage.success('添加成功')
  dialogVisible.value = false
  form.name = ''
  form.contact = ''
  fetchList()
}

onMounted(fetchList)
</script>