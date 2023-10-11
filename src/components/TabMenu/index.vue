
<template>
  <el-tabs type="card" :model-value="defaultActive" @tab-click="onTabClick" @tab-remove="onTabRemove">
    <el-tab-pane v-for="item in data" :key="item.id" :label="item.label" :name="item.id" :closable="true">
      <template #label>
        <span @contextmenu.prevent.stop="onContextmenu($event, item)">{{ item.label }}</span>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import type { TabsPaneContext, TabPaneName } from 'element-plus'
import { IMenuProp } from '@/common/js/utils'

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<IMenuProp[]>,
      default: () => []
    },
    defaultActive: {
      type: [String, Number],
      default: 0
    }
  },
  components: {
    ElTabs,
    ElTabPane,
  },
  emits: ['tab-click', 'tab-remove', 'tab-contextmenu'],
  setup(props, context) {
    const onTabClick = (tabInstance: TabsPaneContext) => {
      const id = tabInstance.paneName

      context.emit('tab-click', id)
    }

    const onTabRemove = (id: TabPaneName) => {
      context.emit('tab-remove', id)
    }

    const onContextmenu = (event: MouseEvent, item: IMenuProp) => {
      context.emit('tab-contextmenu', event, item)
    }

    return {
      onTabClick,
      onTabRemove,
      onContextmenu,
    }
  }
})
</script>

<style lang="scss" scoped>
.is-link {
  font-weight: 700 !important;
}
</style>