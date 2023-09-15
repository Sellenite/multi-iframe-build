<template>
  <el-menu-item :index="menuItem.id" v-if="!menuItem.children">{{ menuItem.label }}</el-menu-item>
  <el-sub-menu :index="menuItem.id" v-else>
    <template #title>{{ menuItem.label }}</template>
    <side-menu-item v-for="(child, index) in menuItem.children" :key="index" :menu-item="child">
    </side-menu-item>
  </el-sub-menu>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ElMenuItem, ElSubMenu } from 'element-plus'
import { IMenuProp } from '@/common/js/utils'
export default defineComponent({
  name: 'SideMenuItem',
  components: {
    ElMenuItem,
    ElSubMenu,
  },
  props: {
    menuItem: {
      type: Object as PropType<IMenuProp>,
      default: () => {
        return {}
      }
    },
  }
})
</script>