import '@/assets/css/reset.css'
import '@/assets/css/element-ui.css'

import { createApp } from 'vue'

declare global {
  interface Window {
    init: any
  }
}

window.init = (comp: any) => {
  const app = createApp(comp)
  app.mount('#app')
}