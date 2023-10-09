
<template>
  <el-tabs type="card" :model-value="tabValue" @tab-click="onTabClick" @tab-remove="onTabRemove">
    <el-tab-pane v-for="item in data" :key="item.id" :label="item.label" :name="item.id" :closable="true">
      <template #label>
        <span>{{ item.label }}</span>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import type { TabsPaneContext, TabPaneName } from 'element-plus'
import { IMenuProp } from '@/common/js/utils'

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<IMenuProp[]>,
      default: () => []
    },
    activeTab: {
      type: Object as PropType<IMenuProp|null>,
    }
  },
  components: {
    ElTabs,
    ElTabPane,
  },
  emits: ['tab-click', 'tab-remove'],
  setup(props, context) {
    const tabValue = computed(() => {
      if (props.activeTab) {
        return props.activeTab.id
      } else {
        return 0
      }
    })

    const onTabClick = (tabInstance: TabsPaneContext) => {
      const id = tabInstance.paneName

      context.emit('tab-click', id)
    }

    const onTabRemove = (id: TabPaneName) => {
      context.emit('tab-remove', id)
    }

    return {
      tabValue,
      onTabClick,
      onTabRemove,
    }
  }
})
</script>

<style lang="scss" scoped>
.is-link {
  font-weight: 700 !important;
}
</style>