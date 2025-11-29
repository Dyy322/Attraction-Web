<template>
  <div class="space-y-6">

    <div class="bg-white p-6 rounded shadow">
      <h2 class="text-xl font-bold mb-6">📢 活动说明配置</h2>
      <el-form label-width="120px" :model="activityForm">
        <el-form-item label="活动标题">
          <el-input v-model="activityForm.title" placeholder="例如：双山金秋登山节" />
        </el-form-item>

        <el-form-item label="活动详情">
          <div class="border border-gray-300 rounded w-full">
            <QuillEditor
                theme="snow"
                v-model:content="activityForm.content"
                contentType="html"
                style="height: 250px;"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSaveActivity" :loading="loadingAct">保存活动信息</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="bg-white p-6 rounded shadow">
      <h2 class="text-xl font-bold mb-6">☎️ 客服热线设置</h2>
      <el-form label-width="120px" :model="hotlineForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话">
              <el-input v-model="hotlineForm.phone" placeholder="例如：0752-1234567" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务时间">
              <el-input v-model="hotlineForm.service_time" placeholder="例如：9:00 - 18:00" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="success" @click="handleSaveHotline" :loading="loadingHot">保存热线信息</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
// 引入 API
import { getActivity, updateActivity, getHotline, updateHotline } from '@/api/content'
import { ElMessage } from 'element-plus'

const loadingAct = ref(false)
const loadingHot = ref(false)

const activityForm = reactive({
  title: '',
  content: ''
})

const hotlineForm = reactive({
  phone: '',
  service_time: ''
})

// 初始化加载
const initData = async () => {
  try {
    // 并行请求两个接口
    const [resAct, resHot] = await Promise.all([getActivity(), getHotline()])

    // 填充活动数据
    if (resAct.data) {
      activityForm.title = resAct.data.title || ''
      activityForm.content = resAct.data.content || ''
    }

    // 填充热线数据
    if (resHot.data) {
      hotlineForm.phone = resHot.data.phone || ''
      hotlineForm.service_time = resHot.data.service_time || ''
    }

  } catch (error) {
    console.error(error)
    ElMessage.error('部分数据加载失败')
  }
}

// 保存活动
const handleSaveActivity = async () => {
  loadingAct.value = true
  try {
    await updateActivity(activityForm)
    ElMessage.success('活动信息保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    loadingAct.value = false
  }
}

// 保存热线
const handleSaveHotline = async () => {
  loadingHot.value = true
  try {
    await updateHotline(hotlineForm)
    ElMessage.success('热线信息保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    loadingHot.value = false
  }
}

onMounted(() => {
  initData()
})
</script>