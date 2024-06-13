import { createApp } from 'vue'

import App from './App.vue'
import ElementPlus from 'element-plus';  
import 'D:/manage/manage/node_modules/.store/element-plus@2.7.3/node_modules/element-plus/theme-chalk/index.css'
const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
