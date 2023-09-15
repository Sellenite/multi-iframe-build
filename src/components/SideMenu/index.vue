<template>
  <el-menu>
    <side-menu-item v-for="item in data" :key="item.id" :menuItem="item"></side-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ElMenu } from 'element-plus'
import SideMenuItem from './sideMenuItem.vue'
import { IMenuProp } from '@/common/js/utils'
export default defineComponent({
  name: 'SideMenu',
  components: {
    ElMenu,
    SideMenuItem,
  },
  props: {
    data: {
      type: Array as PropType<IMenuProp[]>,
      default: () => []
    },
  }
})
</script>