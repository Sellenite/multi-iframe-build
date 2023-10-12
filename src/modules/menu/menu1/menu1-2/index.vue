<template>
  <div class="page">
    menu1-2
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import usePostmessage from '@/common/hooks/usePostmessage'

export default defineComponent({
  setup() {
    const { watchMessage } = usePostmessage()

    watchMessage((params) => {
      console.log(params)
    })

    return {}
  }
})
</script>

<style lang="scss" scoped></style>