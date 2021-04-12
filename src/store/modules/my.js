import Axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
export default {
  namespaced: true,
  // 属性
  state: {
    myToken: window.sessionStorage.getItem('token'),
    num: 1
  },
  getters: {
    price: function() {
      return 100 * Math.random()
    }
  },
  // 操作
  mutations: {
    setToken(state, payload) {
      state.myToken = payload
      window.sessionStorage.setItem('token', payload)
    },
    add(state) {
      state.num += 1
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
    },
    getToken(context, payload) {},
    go_add(context, payload) {
      context.commit('add')
    }
  }
}
