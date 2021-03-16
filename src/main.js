import Vue from 'vue'
import 'default-passive-events'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入图标样式
import './assets/fonts/iconfont.css'
import Axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
Vue.config.productionTip = false
// axios配置
Vue.prototype.$http = Axios
Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
// 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
// 这个拦截器会在你发送请求之前运行
// 我的这个请求拦截器的功能是为我每一次请求去判断是否有token，如果token存在则在请求头加上这个token。后台会判断我这个token是否过期。
Axios.interceptors.request.use(config => {
  // console.log(config)
  // 展示进度条
  // NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})

// // 在reponse拦截器中，隐藏进度条 NProgress.done()
// Axios.interceptors.response.use(config => {
//   // 隐藏进度条
//   NProgress.done()
//   return config
// })
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
