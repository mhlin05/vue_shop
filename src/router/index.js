import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/user/Users.vue'
import Rights from '@/components/power/Rights.vue'
import Roles from '@/components/power/Roles.vue'
import Cate from '@/components/goods/Cate.vue'
import Params from '@/components/goods/Params.vue'
import List from '@/components/goods/List.vue'
import Add from '@/components/goods/Add.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      // 这么写的问题是 这样只能把路由出口设置在List.vue里面 不能完全显示
      {
        path: '/goods',
        component: List
        // children: [{ path: 'add', component: Add }]
      },
      { path: '/goods/add', component: Add }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 如果去的是login页面 直接放
  if (to.path === '/login') next()
  // 否则需要验证token
  const nToken = window.sessionStorage.getItem('token')
  if (!nToken) return next('/login')
  next()
})
export default router
