<template>
  <div class="h-screen w-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">管理员登录</h2>

      <!-- 表单绑定 -->
      <el-form size="large">
        <el-form-item>
          <!-- 关键点1: 添加 v-model -->
          <el-input
              v-model="form.username"
              placeholder="账号 (admin)"
              :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item>
          <!-- 关键点2: 添加 v-model 和回车登录功能 -->
          <el-input
              v-model="form.password"
              type="password"
              placeholder="密码 (123456)"
              show-password
              :prefix-icon="Lock"
              @keyup.enter="handleLogin"
          />
        </el-form-item>

        <!-- 关键点3: 绑定点击事件 @click -->
        <el-button
            type="primary"
            class="w-full mt-4"
            :loading="loading"
            @click="handleLogin"
        >
          登录
        </el-button>
      </el-form>

      <div class="mt-4 text-center text-xs text-gray-400">
        测试账号: admin / 123456
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user' // stores/user.js
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue' // 引入图标

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)

// 响应式数据，用于绑定输入框
const form = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  // 1. 校验输入
  if (!form.value.username || !form.value.password) {
    ElMessage.warning('请输入账号和密码')
    return
  }

  loading.value = true

  try {
    // 2. 调用 Store 中的登录逻辑
    const success = await userStore.login(form.value.username, form.value.password)

    if (success) {
      ElMessage.success('登录成功')
      router.push('/dashboard') // 跳转
    } else {
      ElMessage.error('账号或密码错误')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('登录发生异常')
  } finally {
    loading.value = false
  }
}
</script>