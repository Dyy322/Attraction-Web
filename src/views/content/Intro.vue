<template>
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-6">📝 简介管理</h2>

    <el-form label-width="100px">
      <el-form-item label="标题">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="详细内容">
        <!-- 富文本编辑器 -->
        <QuillEditor theme="snow" v-model:content="form.body_md" contentType="html" style="height: 300px; width: 100%" />
      </el-form-item>

      <el-form-item class="mt-12">
        <el-button type="primary" @click="handleSave" :loading="loading">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { getIntro, updateIntro } from '@/api/content' // 引入刚才建的 API
import { ElMessage } from 'element-plus'

const form = ref({
  title: '',
  body_md: '', // 这里后端字段叫 body_md，看你要存 markdown 还是 html
  media_urls: []
})
const loading = ref(false)

// 加载数据
const fetchData = async () => {
  try {
    // const res = await getIntro()
    // form.value = res.data // 根据实际后端返回结构调整

    // --- 模拟数据 (后端没好时用这个) ---
    form.value = {
      title: '双山引领区欢迎您',
      body_md: '<p>这里是南昆山与罗浮山...</p>'
    }
  } catch (error) {
    console.error(error)
  }
}

// 保存数据
const handleSave = async () => {
  loading.value = true
  try {
    await updateIntro(form.value)
    ElMessage.success('保存成功')
  } catch (error) {
    // 即使失败也可能是因为后端没好，提示一下
    ElMessage.error('保存失败 (可能后端接口未就绪)')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>