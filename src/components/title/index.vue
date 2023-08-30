<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  props: {
    title: String
  },
  setup(props, context) {
    const titleShow = ref('')
    titleShow.value = 'title:' + props.title

    return {
      titleShow
    }
  },
  render() {
    return <div class="v-title">{ this.titleShow }</div>
  }
})
</script>

<style scoped>
  .v-title {
    color: red;
  }
</style>