import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import Axios from 'axios'
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
Vue.config.productionTip = false
// axios配置
Vue.prototype.$http = Axios
Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Axios.interceptors.request.use(config => {
//   console.log(config)
//   // 展示进度条
//   NProgress.start()
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   // 在最后必须return config
//   return config
// })

// // 在reponse拦截器中，隐藏进度条 NProgress.done()
// Axios.interceptors.response.use(config => {
//   // 隐藏进度条
//   NProgress.done()
//   return config
// })
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
