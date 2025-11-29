<template>
  <div class="bg-white p-6 rounded shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">🎁 礼品兑换库</h2>
      <el-button type="primary" @click="openDialog()">+ 上架新礼品</el-button>
    </div>

    <el-table :data="giftList" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="礼品图片" width="100">
        <template #default="scope">
          <div class="w-16 h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded">
            {{ scope.row.image ? '有图' : '无图' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="礼品名称" />
      <el-table-column prop="points" label="所需积分" width="120">
        <template #default="{ row }">
          <span class="text-orange-500 font-bold">{{ row.points }} 分</span>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="100" />
      <el-table-column label="供应商" width="150">
        <template #default="{ row }">
          {{ getSupplierName(row.supplier_id) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="openDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑礼品' : '上架礼品'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="礼品名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="所需积分">
          <el-input-number v-model="form.points" :min="1" />
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        <el-form-item label="供应商">
          <el-select v-model="form.supplier_id" placeholder="请选择供应商" style="width: 100%">
            <el-option
                v-for="s in suppliers"
                :key="s.id"
                :label="s.name"
                :value="s.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片链接">
          <el-input v-model="form.image" placeholder="http://..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { getGifts, createGift, updateGift, deleteGift, getSuppliers } from '@/api/marketing'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const dialogVisible = ref(false)
const giftList = ref([])
const suppliers = ref([]) // 供应商列表，用于下拉框

const form = reactive({
  id: null,
  name: '',
  points: 100,
  stock: 10,
  supplier_id: null,
  image: ''
})

const isEdit = computed(() => !!form.id)

// 辅助函数：通过ID找供应商名字
const getSupplierName = (id) => {
  const s = suppliers.value.find(item => item.id === id)
  return s ? s.name : '-'
}

const fetchData = async () => {
  loading.value = true
  try {
    // 并行获取礼品和供应商数据
    const [resGifts, resSuppliers] = await Promise.all([getGifts(), getSuppliers()])
    giftList.value = resGifts.data.list || resGifts.data || []
    suppliers.value = resSuppliers.data || []
  } finally {
    loading.value = false
  }
}

const openDialog = (row = null) => {
  if (row) {
    Object.assign(form, row)
  } else {
    form.id = null
    form.name = ''
    form.points = 100
    form.stock = 10
    form.supplier_id = null
    form.image = ''
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await updateGift(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await createGift(form)
      ElMessage.success('上架成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定下架该礼品吗？', '提示', { type: 'warning' })
      .then(async () => {
        await deleteGift(row.id)
        ElMessage.success('已下架')
        fetchData()
      })
}

onMounted(fetchData)
</script>