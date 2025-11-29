<template>
  <div class="bg-white p-6 rounded shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">📝 简介管理</h2>
    </div>

    <el-form label-width="120px" :model="form">
      <el-form-item label="标题">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="媒体链接">
        <el-input
            v-model="mediaUrlStr"
            type="textarea"
            :rows="3"
            placeholder="请输入图片或视频链接，一行一个"
        />
        <div class="text-gray-400 text-xs mt-1">请直接输入URL地址，多个地址请换行</div>
      </el-form-item>

      <el-form-item label="详细内容">
        <div class="border border-gray-300 rounded w-full">
          <QuillEditor
              theme="snow"
              v-model:content="form.body_md"
              contentType="html"
              style="height: 350px;"
          />
        </div>
      </el-form-item>

      <el-form-item class="mt-8">
        <el-button type="primary" @click="handleSave" :loading="loading" size="large">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { getIntro, updateIntro } from '@/api/content'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const mediaUrlStr = ref('') // 用于在 Textarea 中显示字符串

const form = reactive({
  title: '',
  body_md: '', // 这里存储 Quill 生成的 HTML
  media_urls: []
})

// 监听字符串变化，同步回数组
watch(mediaUrlStr, (val) => {
  form.media_urls = val.split('\n').filter(url => url.trim() !== '')
})

// 加载数据
const fetchData = async () => {
  try {
    loading.value = true
    // 调用 API (Mock或真实由 src/api/content.js 决定)
    const res = await getIntro()
    const data = res.data || {}

    form.title = data.title || ''
    form.body_md = data.body_md || '' // API 返回的内容
    form.media_urls = data.media_urls || []

    // 数组转字符串显示
    mediaUrlStr.value = form.media_urls.join('\n')
  } catch (error) {
    console.error(error)
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

// 保存数据
const handleSave = async () => {
  loading.value = true
  try {
    await updateIntro(form)
    ElMessage.success('保存成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>