<template>
  <div class="main-page">
    <div class="layout-left">
      <side-menu :data="menuTreeData" :default-active="activeMenu?.id" @select-menu="onSelectMenu"></side-menu>
    </div>
    <div class="layout-right">
      <div class="layout-right-top">
        <breadcrumb :data="breadcrumbData"></breadcrumb>
        <tab-menu :data="tabMenuData" :default-active="activeMenu?.id" @tab-click="onTabClick" @tab-remove="onTabRemove"
          @tab-contextmenu="onTabContextmenu"></tab-menu>
        <el-contextmenu theme="dark" ref="tabContextmenu">
          <el-contextmenu-item :auto-hide="false">欢迎使用</el-contextmenu-item>
          <el-contextmenu-item divider></el-contextmenu-item>
          <el-contextmenu-submenu title="操作">
            <el-contextmenu-item @click="handleRefreshIframe">刷新</el-contextmenu-item>
            <el-contextmenu-item divider></el-contextmenu-item>
            <el-contextmenu-item @click="handleRemoveIframe">关闭</el-contextmenu-item>
          </el-contextmenu-submenu>
        </el-contextmenu>
      </div>
      <div class="layout-right-bottom">
        <iframe v-for="item in tabMenuData" :key="item.id" :id="item.id" :src="item.url + '.html'"
          :class="{ 'ui-iframe': true, 'hidden': !(activeMenu?.id === item.id) }" @load="onIframeLoad(item)"></iframe>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { IMenuProp, genFileMenuTree, getRelateNodes } from '@/common/js/utils'
import SideMenu from '@/components/SideMenu/index.vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import TabMenu from '@/components/TabMenu/index.vue'
import { ElContextmenu, ElContextmenuItem, ElContextmenuSubmenu } from '@/components/Contextmenu/index'

interface IPosition {
  top: number;
  left: number;
}

export default defineComponent({
  components: {
    SideMenu,
    Breadcrumb,
    TabMenu,
    ElContextmenu,
    ElContextmenuItem,
    ElContextmenuSubmenu,
  },
  setup() {
    const tabContextmenu = ref<{ show: (payload: IPosition) => void } | null>(null)
    const menuTree = genFileMenuTree()

    const menuTreeData = ref(menuTree[0].children)
    const activeMenu = ref<IMenuProp | null>(null)
    const breadcrumbData = ref<IMenuProp[]>([])
    const tabMenuData = ref<IMenuProp[]>([])
    const currentContextMenuData = ref<IMenuProp | null>(null)

    const onSelectMenu = (data: IMenuProp) => {
      _handlePushTab(data)
    }

    const onTabClick = (id: string) => {
      const data = tabMenuData.value.find(v => v.id === id)
      if (data) {
        activeMenu.value = data
      }

      const nodes = getRelateNodes(id, 'id', menuTree)
      breadcrumbData.value = nodes
    }

    const onTabRemove = (id: string) => {
      _handleRemoveTab(id)
    }

    const _handlePushTab = (data: IMenuProp) => {
      const existMenuIndex = tabMenuData.value.findIndex(v => v.id === data.id)
      if (existMenuIndex === -1) {
        tabMenuData.value.push(data)
      }
      const nodes = getRelateNodes(data.id, 'id', menuTree)
      breadcrumbData.value = nodes

      activeMenu.value = data
    }

    const _handleRemoveTab = (id: string) => {
      const index = tabMenuData.value.findIndex(v => v.id === id)
      if (index !== -1) {
        tabMenuData.value.splice(index, 1)
      }
      if (activeMenu.value?.id === id) {
        const prevIndex = index - 1
        if (prevIndex >= 0) {
          activeMenu.value = tabMenuData.value[prevIndex]
          const nodes = getRelateNodes(activeMenu.value.id, 'id', menuTree)
          breadcrumbData.value = nodes
        } else {
          if (tabMenuData.value.length > 0) {
            activeMenu.value = tabMenuData.value.slice(-1)[0]
            const nodes = getRelateNodes(activeMenu.value.id, 'id', menuTree)
            breadcrumbData.value = nodes
          }
        }
      }
    }

    const onTabContextmenu = (event: MouseEvent, item: IMenuProp) => {
      tabContextmenu.value && tabContextmenu.value.show({ top: event.pageY, left: event.pageX })
      currentContextMenuData.value = item
    }

    const onIframeLoad = (item: IMenuProp) => {
      console.log('page load: ', item.url)
    }

    const handleRefreshIframe = () => {
      const id = currentContextMenuData.value?.id
      const iframe = document.querySelector(`#${id}`) as HTMLIFrameElement
      iframe.contentWindow && iframe.contentWindow.location.reload()
    }

    const handleRemoveIframe = () => {
      _handleRemoveTab(currentContextMenuData.value?.id as string)
    }

    return {
      tabContextmenu,
      menuTreeData,
      activeMenu,
      breadcrumbData,
      tabMenuData,
      onSelectMenu,
      onTabClick,
      onTabRemove,
      onTabContextmenu,
      onIframeLoad,
      handleRefreshIframe,
      handleRemoveIframe,
    }
  },
})
</script>

<style lang="scss" scoped>
.main-page {
  height: 100%;
  display: flex;

  .layout-left {
    flex: 0 0 200px;
    border-right: 1px solid #dcdfe6;
  }

  .layout-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: calc(100% - 200px);

    .layout-right-top {
      height: 80px;
      background-color: #FFF;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      padding-left: 12px;
      padding-top: 12px;
      position: relative;
    }

    .layout-right-bottom {
      flex: 1;
      overflow: auto;
      font-size: 0;
    }
  }

  .ui-iframe {
    width: 100%;
    height: 100%;
    border: none;
    background-color: #FFF;
  }
}
</style>