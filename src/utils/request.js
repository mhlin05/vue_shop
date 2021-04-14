import Axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// axios实例
const Service = Axios.create({
  baseURL: 'http://10.12.44.155:8888/api/private/v1/',
  timeout: 20000
})

// 请求拦截器
Service.interceptors.request.use(config => {
  // 展示进度条

  NProgress.start()
  // config 是当前请求的相关配置信息对象，可以修改
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  // 当这里 return config之后，才会真正发送请求
  return config
})
// 响应拦截器
Service.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done()
  return config
})
export default Service
