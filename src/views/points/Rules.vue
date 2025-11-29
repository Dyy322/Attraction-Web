<template>
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-6">⚙️ 积分获取规则</h2>

    <el-table :data="rules" border stripe>
      <el-table-column prop="name" label="规则名称" width="200" />
      <el-table-column prop="description" label="说明" />
      <el-table-column label="奖励积分" width="200">
        <template #default="{ row }">
          <div v-if="editingId === row.id" class="flex gap-2">
            <el-input-number v-model="row.editPoints" size="small" :min="1" />
            <el-button type="success" size="small" @click="saveRule(row)">保存</el-button>
            <el-button size="small" @click="cancelEdit(row)">取消</el-button>
          </div>
          <div v-else class="flex justify-between items-center px-4">
            <span class="font-bold text-blue-600">+ {{ row.points }}</span>
            <el-button link type="primary" @click="startEdit(row)">修改</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-4 text-sm text-gray-500">
      * 部分规则（如打卡距离校验）由系统底层控制，此处仅配置分值。
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRules, updateRule } from '@/api/marketing'
import { ElMessage } from 'element-plus'

const rules = ref([])
const editingId = ref(null)

const fetchRules = async () => {
  const res = await getRules()
  rules.value = res.data.map(r => ({ ...r, editPoints: r.points }))
}

const startEdit = (row) => {
  editingId.value = row.id
  row.editPoints = row.points // 重置为当前值
}

const cancelEdit = (row) => {
  editingId.value = null
}

const saveRule = async (row) => {
  try {
    await updateRule(row.id, { points: row.editPoints })
    row.points = row.editPoints
    editingId.value = null
    ElMessage.success('规则已更新')
  } catch (e) {
    ElMessage.error('保存失败')
  }
}

onMounted(fetchRules)
</script>