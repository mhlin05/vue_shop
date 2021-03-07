import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import Axios from 'axios'
Vue.config.productionTip = false
// axios配置
Vue.prototype.$http = Axios
Axios.defaults.baseURL = ''

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
