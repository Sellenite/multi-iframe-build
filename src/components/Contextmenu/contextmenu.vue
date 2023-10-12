<template>
  <ul ref="contextmenu" :class="contextmenuCls" v-show="visible" :style="style">
    <slot></slot>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, onUnmounted, provide } from 'vue'

interface IPosition {
  top: number;
  left: number;
}

export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'default'
    },
    disabled: Boolean
  },
  emits: ['show', 'hide'],
  setup(props, context) {
    const contextmenu = ref<HTMLElement | null>(null)
    const visible = ref(false)
    const style = ref({
      top: '0px',
      left: '0px'
    })
    const contextmenuCls = computed(() => {
      return ['ui-contextmenu', `ui-contextmenu--${props.theme}`]
    })

    const handleBodyClick = (event: MouseEvent) => {
      if (contextmenu.value) {
        const isInside = contextmenu.value.contains(event.target as HTMLElement)
        if (!isInside) {
          visible.value = false
        }
      }
    }

    const show = (position: IPosition) => {
      if (props.disabled) {
        return
      }
      if (position) {
        style.value = {
          top: `${position.top}px`,
          left: `${position.left}px`
        }
      }

      visible.value = true
    }

    const hide = () => {
      visible.value = false
    }

    watch(visible, (value) => {
      if (value) {
        context.emit('show')
        document.body.addEventListener('click', handleBodyClick)
      } else {
        context.emit('hide')
        document.body.removeEventListener('click', handleBodyClick)
      }
    })

    onMounted(() => {
      contextmenu.value && document.body.appendChild(contextmenu.value)
    })

    onUnmounted(() => {
      contextmenu.value && document.body.removeChild(contextmenu.value)

      document.body.removeEventListener('click', handleBodyClick)
    })

    provide('hide', hide)

    return {
      contextmenu,
      visible,
      style,
      contextmenuCls,
      show,
      hide,
    }
  }
})
</script>

<style lang="scss">
@import './contextmenu.scss';
</style>