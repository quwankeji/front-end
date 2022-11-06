import { createApp } from 'vue'
import '@/assets/css/main.less';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueLazyload from "vue-lazyload";
import VideoPlay from 'vue3-video-play' // 引入组件 
import 'vue3-video-play/dist/style.css' // 引入css 
import ZWRequest from '@/http/index.ts'
import VuemoothScroll from "vue-smooth-scroll";//隐藏滚动条
import router from "./router/index"
import App from './App.vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(ElementPlus).use(VuemoothScroll).use(ZWRequest).use(VueLazyload).use(VideoPlay).use(router).mount('#app')
