<template>
  <el-container class="layout">
    <el-aside
        class="aside"
        :class="uiStore.asideShow ? 'aside-show' : 'el-aside-hide'">
      <Aside />
    </el-aside>
    <div
        :class="(uiStore.asideShow && isMobile)? 'overlay-show':'overlay-hide'"
        @click="uiStore.asideShow = false"
    ></div>
    <el-container class="main-container" :class="{ 'dashboard-has-background': settingStore.dashboard?.background }" :style="dashboardStyle">
      <el-main>
        <el-header>
            <Header />
        </el-header>
        <Main />
      </el-main>
    </el-container>
  </el-container>
  <writer ref="writerRef" />
</template>

<script setup>
import Aside from '@/layout/aside/index.vue'
import Header from '@/layout/header/index.vue'
import Main from '@/layout/main/index.vue'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import {useUiStore} from "@/store/ui.js";
import {useSettingStore} from "@/store/setting.js";
import writer from '@/layout/write/index.vue'

const uiStore = useUiStore();
const settingStore = useSettingStore();
const dashboardStyle = computed(() => {
  const dashboard = settingStore.dashboard || {}
  return {
    '--dashboard-accent': dashboard.accent || '#6d5dfc',
    '--dashboard-overlay': dashboard.overlay ?? 0.08,
    '--dashboard-surface-opacity': `${Math.round((dashboard.surfaceOpacity ?? 0.58) * 100)}%`,
    ...(dashboard.background ? {
      backgroundImage: `linear-gradient(rgba(12, 16, 38, ${dashboard.overlay ?? 0.08}), rgba(12, 16, 38, ${dashboard.overlay ?? 0.08})), url(${dashboard.background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    } : {})
  }
})
const writerRef = ref({})
const isMobile = ref(window.innerWidth < 1025)
const handleResize = () => {
  isMobile.value = window.innerWidth < 1025
  uiStore.asideShow = window.innerWidth > 1024;
}

onMounted(() => {
  uiStore.writerRef = writerRef

  window.addEventListener('resize', handleResize)
  handleResize()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.el-aside-hide {
  position: fixed;
  left: 0;
  height: 100%;
  z-index: 100;
  transform: translateX(-100%);
  transition: all 100ms ease;
}

.aside-show {
  -webkit-box-shadow: var(--aside-right-border);
  box-shadow: var(--aside-right-border);
  transform: translateX(0);
  transition: all 100ms ease;
  z-index: 101;
  @media (max-width: 1025px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
    height: 100%;
    background: var(--el-bg-color);
  }
}

.el-aside {
  width: auto;
  transition: all 100ms ease;
}

.layout {
  height: 100%;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}

.main-container {
  min-height: 100%;
  background: var(--el-bg-color);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.dashboard-has-background { background-color: transparent; }

.el-main {
  padding: 0;
}

.el-header {
  background: var(--el-bg-color);
  border-bottom: solid 1px var(--el-border-color);
  padding: 0 0 0 0;
}

.dashboard-has-background .el-header { background: color-mix(in srgb, var(--el-bg-color) var(--dashboard-surface-opacity), transparent); backdrop-filter: blur(14px); }
.dashboard-has-background :deep(.settings-card),
.dashboard-has-background :deep(.user-box),
.dashboard-has-background :deep(.el-table),
.dashboard-has-background :deep(.el-table__inner-wrapper),
.dashboard-has-background :deep(.el-table tr),
.dashboard-has-background :deep(.el-table th.el-table__cell),
.dashboard-has-background :deep(.el-table td.el-table__cell) {
  background: color-mix(in srgb, var(--el-bg-color) var(--dashboard-surface-opacity), transparent) !important;
  backdrop-filter: blur(8px);
}

.overlay-show {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
  transition: all 0.3s;
}

.overlay-hide {
  display: flex;
  pointer-events: none;
  opacity: 0;
}
</style>
