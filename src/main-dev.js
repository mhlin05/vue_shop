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
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器及样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import filters from './filters'
Vue.use(VueQuillEditor /* { default global options } */)
Vue.config.productionTip = false

// 配置过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
