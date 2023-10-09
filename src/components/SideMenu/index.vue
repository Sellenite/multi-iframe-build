<template>
  <el-menu @select="onSelect" :default-active="defaultActive">
    <side-menu-item v-for="item in data" :key="item.id" :menuItem="item"></side-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ElMenu } from 'element-plus'
import SideMenuItem from './sideMenuItem.vue'
import { IMenuProp, traverseTree } from '@/common/js/utils'
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
    defaultActive: {
      type: String
    }
  },
  emits: ['select-menu'],
  setup(props, context) {
    const onSelect = (id: string) => {
      let item

      traverseTree<IMenuProp>(props.data, (v) => {
        if (v.id === id) {
          item = v
        }
      })

      context.emit('select-menu', item)
    }

    return {
      onSelect
    }
  }
})
</script>