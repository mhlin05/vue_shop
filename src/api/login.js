import Request from '../utils/request'

// 用户登录
export function login(username, password) {
  console.log('api/login')
  return Request({
    url: 'login',
    method: 'post',
    data: {
      username: username,
      password: password
    }
  })
}

// 用户登出

export function logout() {}
