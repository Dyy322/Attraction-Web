<template>
  <div class="bg-white p-6 rounded shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">{{ isEdit ? '编辑商家' : '新增商家' }}</h2>
      <el-button @click="$router.back()">返回列表</el-button>
    </div>

    <el-form label-width="100px" :model="form" ref="formRef" :rules="rules">
      <el-form-item label="商家名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="商家类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio label="hotel">住宿 (Hotel)</el-radio>
          <el-radio label="restaurant">餐饮 (Restaurant)</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="联系电话" prop="contact">
        <el-input v-model="form.contact" />
      </el-form-item>

      <el-form-item label="详细地址" prop="address">
        <el-input v-model="form.address" />
      </el-form-item>

      <el-form-item label="封面图片">
        <el-input v-model="mediaUrlStr" type="textarea" :rows="2" placeholder="图片 URL" />
      </el-form-item>

      <el-form-item class="mt-8">
        <el-button type="primary" @click="onSubmit" :loading="loading">保存信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMerchant, createMerchant, updateMerchant } from '@/api/resource'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const mediaUrlStr = ref('')

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  name: '',
  type: 'restaurant',
  contact: '',
  address: '',
  images: []
})

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  contact: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
}

watch(mediaUrlStr, (val) => {
  form.images = val.split('\n').filter(s => s.trim())
})

const initData = async () => {
  if (isEdit.value) {
    loading.value = true
    try {
      const res = await getMerchant(route.params.id)
      Object.assign(form, res.data)
      mediaUrlStr.value = (res.data.images || []).join('\n')
    } catch (e) {
      ElMessage.error('加载失败')
    } finally {
      loading.value = false
    }
  }
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (isEdit.value) {
          await updateMerchant(route.params.id, form)
        } else {
          await createMerchant(form)
        }
        ElMessage.success('保存成功')
        router.push('/resource/merchant')
      } catch (e) {
        ElMessage.error('保存失败')
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(initData)
</script>