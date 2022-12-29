import '@/assets/css/main.less';
import 'element-plus/dist/index.css'
import 'vue3-video-play/dist/style.css' 
import '@/assets/css/common/reset.css' 
import 'normalize.css' 
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueLazyload from "vue-lazyload";
import VideoPlay from 'vue3-video-play' 
import VuemoothScroll from "vue-smooth-scroll";//隐藏滚动条
import router from "./router/index"
import store from './store/user'
import App from './App.vue'
const app = createApp(App)
console.log('import.meta.env',import.meta.env)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(ElementPlus).use(VuemoothScroll).use(VueLazyload).use(VideoPlay).use(router).use(store).mount('#app')
