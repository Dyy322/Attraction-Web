<template>
  <div class="flex h-screen w-screen overflow-hidden bg-gray-50">
    <!-- 左侧侧边栏 -->
    <aside class="w-64 bg-slate-800 text-white flex flex-col transition-all">
      <div class="h-16 flex items-center justify-center text-xl font-bold border-b border-slate-700">
        双山管理后台
      </div>

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <!-- 这里的 to 对应路由路径 -->
        <router-link to="/dashboard" class="nav-item">
          📊 数据概览
        </router-link>
        <div class="text-xs text-slate-400 mt-4 mb-2 px-3">内容管理</div>
        <router-link to="/intro" class="nav-item">
          📝 简介与活动
        </router-link>

        <div class="text-xs text-slate-400 mt-4 mb-2 px-3">资源管理</div>
        <router-link to="/poi" class="nav-item">
          🏔️ 景点(POI)
        </router-link>
        <router-link to="/gifts" class="nav-item">
          🎁 礼品管理
        </router-link>
        <router-link to="/users" class="nav-item">
          👨‍👩‍👧‍👦 用户中心
        </router-link>
      </nav>
    </aside>

    <!-- 右侧主体 -->
    <main class="flex-1 flex flex-col min-w-0">
      <!-- 顶栏 -->
      <header class="h-16 bg-white shadow-sm px-6 flex items-center justify-between z-10">
        <div class="text-gray-500">欢迎回来，管理员</div>
        <el-dropdown>
          <span class="el-dropdown-link cursor-pointer flex items-center">
            <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <span class="ml-2">Admin</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/login')">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </header>

      <!-- 内容显示区 -->
      <div class="flex-1 p-6 overflow-auto">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<style scoped>
.nav-item {
  @apply block p-3 rounded text-slate-300 hover:bg-slate-700 hover:text-white transition-colors;
}
.router-link-active {
  @apply bg-blue-600 text-white;
}
</style>