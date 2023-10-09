<template>
  <div class="main-page">
    <div class="layout-left">
      <side-menu :data="menuTreeData" :default-active="activeMenu?.id" @select-menu="onSelectMenu"></side-menu>
    </div>
    <div class="layout-right">
      <div class="layout-right-top">
        <breadcrumb :data="breadcrumbData"></breadcrumb>
        <tab-menu :data="tabMenuData" :default-active="activeMenu?.id" @tab-click="onTabClick"
          @tab-remove="onTabRemove"></tab-menu>
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

export default defineComponent({
  components: {
    SideMenu,
    Breadcrumb,
    TabMenu,
  },
  setup() {
    const menuTree = genFileMenuTree()

    const menuTreeData = ref(menuTree[0].children)
    const activeMenu = ref<IMenuProp | null>(null)
    const breadcrumbData = ref<IMenuProp[]>([])
    const tabMenuData = ref<IMenuProp[]>([])

    const onSelectMenu = (data: IMenuProp) => {
      activeMenu.value = data
      const nodes = getRelateNodes(data.id, 'id', menuTree)
      breadcrumbData.value = nodes

      const existMenuIndex = tabMenuData.value.findIndex(v => v.id === data.id)
      if (existMenuIndex === -1) {
        tabMenuData.value.push(data)
      }
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
      const index = tabMenuData.value.findIndex(v => v.id === id)
      if (index !== -1) {
        tabMenuData.value.splice(index, 1)
      }

      const prevIndex = index - 1
      if (prevIndex >= 0) {
        activeMenu.value = tabMenuData.value[prevIndex]
      } else {
        if (tabMenuData.value.length > 0) {
          activeMenu.value = tabMenuData.value.slice(-1)[0]
        }
      }
    }

    const onIframeLoad = (item: IMenuProp) => {
      console.log('page load: ', item.url)
    }

    return {
      menuTreeData,
      activeMenu,
      breadcrumbData,
      tabMenuData,
      onSelectMenu,
      onTabClick,
      onTabRemove,
      onIframeLoad,
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
      padding-left: 13px;
      padding-top: 13px;
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