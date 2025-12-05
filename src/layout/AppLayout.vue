<template>
  <div class="min-h-screen flex bg-gray-100">
    <aside class="w-64 bg-gray-800 text-white flex flex-col">
      <div class="h-16 flex items-center justify-center font-bold text-xl border-b border-gray-700">
        管理后台
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <router-link to="/dashboard" class="block py-2 px-4 rounded hover:bg-gray-700">首页</router-link>
        <div class="text-gray-500 text-xs mt-4 mb-2 uppercase px-4">内容管理</div>
        <router-link to="/content/intro" class="block py-2 px-4 rounded hover:bg-gray-700">简介管理</router-link>
        <router-link to="/content/activity" class="block py-2 px-4 rounded hover:bg-gray-700">活动与热线</router-link>
        <div class="text-gray-500 text-xs mt-4 mb-2 uppercase px-4">资源中心</div>
        <router-link to="/resource/poi" class="block py-2 px-4 rounded hover:bg-gray-700">景点管理</router-link>
        <router-link to="/resource/merchant" class="block py-2 px-4 rounded hover:bg-gray-700">商家管理</router-link>
        <div class="text-gray-500 text-xs mt-4 mb-2 uppercase px-4">营销中心</div>
        <router-link to="/marketing/gifts" class="block py-2 px-4 rounded hover:bg-gray-700">礼品库</router-link>
        <router-link to="/marketing/suppliers" class="block py-2 px-4 rounded hover:bg-gray-700">供应商管理</router-link>
        <router-link to="/marketing/rules" class="block py-2 px-4 rounded hover:bg-gray-700">积分规则</router-link>
        <div class="text-gray-500 text-xs mt-4 mb-2 uppercase px-4">系统设置</div>
        <router-link to="/system/roles" class="block py-2 px-4 rounded hover:bg-gray-700">角色管理</router-link>
        <router-link to="/system/permissions" class="block py-2 px-4 rounded hover:bg-gray-700">权限列表</router-link>
        <router-link to="/system/users" class="block py-2 px-4 rounded hover:bg-gray-700">用户管理</router-link>
      </nav>
      <div class="p-4 border-t border-gray-700 bg-gray-900">
        <button @click="handleLogout" class="w-full flex items-center justify-center py-2 px-4 rounded bg-red-600 hover:bg-red-700 transition text-sm text-white">
          <span>退出登录</span>
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-auto">
      <header class="h-16 bg-white shadow flex items-center px-6">
        <h1 class="text-xl font-semibold text-gray-800">{{ $route.meta.title || '后台管理' }}</h1>
      </header>
      <div class="p-6">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 执行登出逻辑
    await userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  }).catch(() => {})
}
</script>