<template>
  <div class="main-page">
    <el-button>Main</el-button>
    <img src="~@/assets/images/logo.jpg" alt="">
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { flatTreeList } from '@/common/data/menu'
import { listToTree, treeToMenu, getRelateNodes } from '@/common/js/utils'

export default defineComponent({
  setup() {
    const tree = listToTree(flatTreeList)
    const menu = treeToMenu(tree)
    const relateMenu = getRelateNodes('2-2', 'id', menu)
    console.log(tree)
    console.log(menu)
    console.log(relateMenu)
    console.log(process.env.NODE_ENV)
    console.log(process.env.BASE_ENV)
    console.log(process.env.BASE_ENV)
    console.log(process.env.BASE_ENV)
    console.log(process.env.BASE_ENV)
    console.log(process.env.BASE_ENV)
    return {}
  }
})
</script>

<style lang="scss" scoped>
.main-page {}
</style>