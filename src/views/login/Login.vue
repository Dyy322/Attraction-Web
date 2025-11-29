<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold text-center text-gray-900 mb-8">
        双山引领区管理后台
      </h2>

      <div v-if="isMock" class="mb-4 bg-yellow-50 text-yellow-700 p-2 text-xs rounded text-center">
        ⚠️ 当前处于 Mock 开发模式 (无需后端)
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">账号</label>
          <input v-model="loginForm.username" type="text" required
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">密码</label>
          <input v-model="loginForm.password" type="password" required
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <button type="submit" :disabled="loading"
                class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

// 读取环境变量仅用于展示提示，不参与逻辑
const isMock = import.meta.env.VITE_USE_MOCK === 'true'

const loginForm = reactive({
  username: 'admin',
  password: ''
})

const handleLogin = () => {
  loading.value = true
  userStore.login(loginForm)
      .then(() => {
        console.log('登录成功，准备跳转...')
        router.push({ path: '/' })
      })
      .catch((err) => {
        console.error(err)
        alert('登录失败')
      })
      .finally(() => {
        loading.value = false
      })
}
</script>