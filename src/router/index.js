import Vue from 'vue'
import VueRouter from 'vue-router'
const Rights = () => import('@/components/power/Rights.vue')
const Roles = () => import('@/components/power/Roles.vue')
const Order = () => import('@/components/order/Order.vue')
const Report = () => import('@/components/report/Report.vue')

const Cate = () => import('@/components/goods/Cate.vue')
const Params = () => import('@/components/goods/Params.vue')
const List = () => import('@/components/goods/List.vue')
const Add = () => import('@/components/goods/Add.vue')
// import Login from '@/components/Login.vue'

// import Users from '@/components/user/Users.vue'
const Users = () => import('@/components/user/Users.vue')

// import Home from '@/components/Home.vue'
// import Welcome from '@/components/Welcome.vue'
const Home = () => import('@/components/Home.vue')
const Welcome = () => import('@/components/Welcome.vue')
const Login = () => import('@/components/Login.vue')

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
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // // 如果去的是login页面 直接放
  if (to.path === '/login') next()
  // 否则需要验证token
  else {
    const nToken = window.sessionStorage.getItem('token')
    if (!nToken) return next('/login')
    next()
  }
})
export default router
