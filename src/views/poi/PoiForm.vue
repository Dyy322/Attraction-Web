<template>
  <div class="bg-white p-6 rounded shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">{{ isEdit ? '编辑景点' : '新增景点' }}</h2>
      <el-button @click="$router.back()">返回列表</el-button>
    </div>

    <el-form label-width="100px" :model="form" ref="formRef" :rules="rules">
      <el-form-item label="景点名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入景点名称" />
      </el-form-item>

      <el-form-item label="经纬度" required>
        <el-col :span="11">
          <el-form-item prop="lat">
            <el-input-number v-model="form.lat" :precision="6" :step="0.0001" placeholder="纬度 (Latitude)" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="2" class="text-center">-</el-col>
        <el-col :span="11">
          <el-form-item prop="lon">
            <el-input-number v-model="form.lon" :precision="6" :step="0.0001" placeholder="经度 (Longitude)" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="地址描述" prop="address">
        <el-input v-model="form.address" placeholder="例如：惠州市龙门县..." />
      </el-form-item>

      <el-form-item label="图片链接">
        <el-input v-model="mediaUrlStr" type="textarea" :rows="3" placeholder="图片 URL，一行一个" />
      </el-form-item>

      <el-form-item label="景点介绍">
        <div class="border border-gray-300 rounded w-full">
          <QuillEditor theme="snow" v-model:content="form.description" contentType="html" style="height: 300px;" />
        </div>
      </el-form-item>

      <el-form-item class="mt-8">
        <el-button type="primary" @click="onSubmit" :loading="loading">提交保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPoi, createPoi, updatePoi } from '@/api/resource'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const mediaUrlStr = ref('')

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  name: '',
  lat: 23.0,
  lon: 114.0,
  address: '',
  description: '',
  images: []
})

const rules = {
  name: [{ required: true, message: '请输入景点名称', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址描述', trigger: 'blur' }]
}

watch(mediaUrlStr, (val) => {
  form.images = val.split('\n').filter(s => s.trim())
})

const initData = async () => {
  if (isEdit.value) {
    loading.value = true
    try {
      const res = await getPoi(route.params.id)
      const data = res.data
      Object.assign(form, data)
      mediaUrlStr.value = (data.images || []).join('\n')
    } catch (e) {
      ElMessage.error('获取详情失败')
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
          await updatePoi(route.params.id, form)
          ElMessage.success('更新成功')
        } else {
          await createPoi(form)
          ElMessage.success('创建成功')
        }
        router.push('/resource/poi')
      } catch (e) {
        ElMessage.error('操作失败')
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(initData)
</script>