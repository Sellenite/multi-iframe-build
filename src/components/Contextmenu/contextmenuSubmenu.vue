<template>
  <li :class="classname" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
    <span class="ui-contextmenu-submenu__title">
      <slot name="title">{{ title }}</slot>
      <el-icon class="ui-contextmenu-submenu__icon">
        <arrow-right />
      </el-icon>
    </span>
    <ul ref="submenu" v-show="hover" :class="submenuCls">
      <slot></slot>
    </ul>
  </li>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick } from 'vue'
import { ElIcon } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'

export default defineComponent({
  props: {
    title: String,
    disabled: Boolean
  },
  components: {
    ElIcon,
    ArrowRight,
  },
  emits: ['mouseenter', 'mouseleave'],
  setup(props, context) {
    const submenu = ref<HTMLElement | null>(null)
    const hover = ref(false)
    const submenuPlacement = ref<string[]>([])
    const classname = computed(() => {
      return {
        'ui-contextmenu-item': true,
        'ui-contextmenu-submenu': true,
        'ui-contextmenu-item--hover': hover.value,
        'ui-contextmenu-item--disabled': props.disabled,
      }
    })
    const submenuCls = computed(() => {
      return ['ui-contextmenu', ...submenuPlacement.value]
    })

    const onMouseenter = (event: MouseEvent) => {
      if (props.disabled) {
        return
      }

      const target = event.target as HTMLElement
      const targetDimension = target?.getBoundingClientRect()
      hover.value = true
      context.emit('mouseenter', event)

      nextTick(() => {
        const submenuWidth = submenu.value?.clientWidth ?? 0
        const submenuHeight = submenu.value?.clientHeight ?? 0
        const _submenuPlacement = []

        if (targetDimension.right + submenuWidth >= window.innerWidth) {
          _submenuPlacement.push('left')
        } else {
          _submenuPlacement.push('right')
        }

        if (targetDimension.bottom + submenuHeight >= window.innerHeight) {
          _submenuPlacement.push('bottom')
        } else {
          _submenuPlacement.push('top')
        }

        submenuPlacement.value = _submenuPlacement
      })
    }

    const onMouseleave = (event: MouseEvent) => {
      if (props.disabled) {
        return
      }

      hover.value = false

      context.emit('mouseleave', event)
    }

    return {
      submenu,
      hover,
      classname,
      submenuCls,
      onMouseenter,
      onMouseleave,
    }
  }
})
</script>