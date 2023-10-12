<template>
  <div class="page">
    <el-button @click="openNewPage">弹出页面</el-button>
    <el-button @click="closeNewPage">关闭页面</el-button>
    <el-button @click="sendMessageToOtherPage">页面通信</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElButton } from 'element-plus'
import usePostmessage from '@/common/hooks/usePostmessage'

export default defineComponent({
  components: {
    ElButton
  },
  setup() {
    const { openTab, closeTab, sendMessage } = usePostmessage()

    const openNewPage = () => {
      openTab({
        id: 'menu1-2',
        label: 'menu1-2',
        url: '/menu/menu1/menu1-2'
      })
    }

    const closeNewPage = () => {
      closeTab({
        id: 'menu1-2'
      })
    }

    const sendMessageToOtherPage = () => {
      sendMessage({
        id: 'menu1-2',
        payload: {
          arrayValue: [1, 2, 3]
        }
      })
    }

    return {
      openNewPage,
      closeNewPage,
      sendMessageToOtherPage,
    }
  }
})
</script>

<style lang="scss" scoped></style>