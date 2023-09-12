import '@/assets/css/reset.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

declare global {
  interface Window {
    init: any
  }
}

window.init = (comp: any) => {
  const app = createApp(comp)
  app.use(ElementPlus)
  app.mount('#app')
}