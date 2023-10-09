
<template>
  <el-breadcrumb separator=">" style="margin-bottom: 12px;">
    <el-breadcrumb-item v-for="(item, index) in data" :key="item.id">
      <template v-if="index === data.length - 1">
        <a class="is-link">{{ item.label }}</a>
      </template>
      <template v-else>
        <span>{{ item.label }}</span>
      </template>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { IMenuProp } from '@/common/js/utils'

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<IMenuProp[]>,
      default: () => []
    }
  },
  components: {
    ElBreadcrumb,
    ElBreadcrumbItem,
  }
})
</script>

<style lang="scss" scoped>
.is-link {
  font-weight: 700 !important;
}
</style>