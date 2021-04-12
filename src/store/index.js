import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'
import my from './modules/my'
Vue.use(Vuex)

export default new Vuex.Store({
  // 模块化
  modules: {
    my,
    test: {
      namespaced: true,
      // 属性
      state: {
        myToken: ''
      },
      // 操作
      mutations: {
        setToken(state, payload) {
          state.myToken = payload
          window.sessionStorage.setItem('token', payload)
        }
      },
      // 异步方法
      actions: {
        // 登录
        async login(context, payload) {
          const { data: res } = await Axios.post('login', payload)
          console.log(res)
          if (res.meta.status !== 200) {
            Message({
              message: '登录失败',
              type: 'error'
            })
          } else {
            Message({
              message: '登录成功',
              type: 'success'
            })
            context.commit('setToken', res.data.token)
            router.push('/home')
          }
        }
      }
    }
  },
  // 计算属性
  getters: {}
})
