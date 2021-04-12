import Vue from 'vue'
import store from './store'
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
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器及样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueQuillEditor /* { default global options } */)
Vue.config.productionTip = false
// axios配置
Vue.prototype.$http = Axios
Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
// 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
// 这个拦截器会在你发送请求之前运行
// 我的这个请求拦截器的功能是为我每一次请求去判断是否有token，如果token存在则在请求头加上这个token。后台会判断我这个token是否过期。

Axios.interceptors.request.use(config => {
  // 展示进度条

  NProgress.start()
  // config 是当前请求的相关配置信息对象，可以修改
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  // 当这里 return config之后，才会真正发送请求
  return config
})

// 在reponse拦截器中，隐藏进度条 NProgress.done()
Axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done()
  return config
})
Vue.filter('datefilter', function(time) {
  const mydate = new Date(time)
  const y = mydate.getFullYear()
  const m = mydate.getMonth() + 1
  const d = mydate.getDate()
  const hour = mydate.getHours()
  const min = mydate.getMinutes()
  const second = mydate.getSeconds()
  return `${y}-${m}-${d} ${hour}:${min}:${second}`
})
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
