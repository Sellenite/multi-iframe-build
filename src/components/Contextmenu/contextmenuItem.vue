<template>
  <li class="ui-contextmenu-divider" v-if="divider"></li>
  <li v-else :class="classname" @click="onClick" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent, ref, computed, inject } from 'vue'

export default defineComponent({
  props: {
    divider: Boolean,
    disabled: Boolean
  },
  emits: ['click', 'mouseenter', 'mouseleave'],
  setup(props, context) {
    const hide = inject<() => void>('hide')
    const hover = ref(false)
    const classname = computed(() => {
      return {
        'ui-contextmenu-item': !props.divider,
        'ui-contextmenu-item--hover': hover.value,
        'ui-contextmenu-item--disabled': props.disabled
      }
    })

    const onClick = (event: MouseEvent) => {
      if (props.disabled) {
        return
      }
      context.emit('click', event)
      hide && hide()
    }

    const onMouseenter = (event: MouseEvent) => {
      if (props.disabled) {
        return
      }
      hover.value = true
      context.emit('mouseenter', event)
    }

    const onMouseleave = (event: MouseEvent) => {
      if (props.disabled) {
        return
      }
      hover.value = false
      context.emit('mouseleave', event)
    }

    return {
      classname,
      onClick,
      onMouseenter,
      onMouseleave,
    }
  }
})
</script>