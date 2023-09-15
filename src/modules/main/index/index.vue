<template>
  <div class="main-page">
    <div class="layout-left">
      <side-menu :data="menu"></side-menu>
    </div>
    <div class="layout-right">
      <div class="layout-right-top"></div>
      <div class="layout-right-bottom"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { flatTreeList } from '@/common/data/menu'
import { listToTree, treeToMenu } from '@/common/js/utils'
import SideMenu from '@/components/SideMenu/index.vue'

export default defineComponent({
  components: {
    SideMenu,
  },
  setup() {
    const tree = listToTree(flatTreeList)
    const menu = treeToMenu(tree)
    return {
      menu
    }
  },
})
</script>

<style lang="scss" scoped>
.main-page {
  height: 100%;
  display: flex;

  .layout-left {
    width: 200px;
    border-right: 1px solid #dcdfe6;
  }

  .layout-right {
    flex: 1;
    display: flex;
    flex-direction: column;

    .layout-right-top {
      height: 50px;
    }

    .layout-right-bottom {
      flex: 1;
    }
  }
}
</style>