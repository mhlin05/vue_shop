import Request from '../utils/request'

// 获取用户列表
export function getUserInfo(queryinfo) {
  return Request({
    url: 'users',
    method: 'GET',
    params: queryinfo
  })
}

// 用户状态改变
export function changeUserState(id, mgState) {
  return Request({
    url: `users/${id}/state/${mgState}`,
    method: 'PUT'
  })
}
// 添加用户
export function addUserRequest(addFormData) {
  return Request({
    method: 'post',
    url: 'users',
    data: addFormData
  })
}
// 修改用户信息
export function modifyUserInfoRequest(modifyFormData) {
  return Request({
    url: `users/${modifyFormData.id}`,
    method: 'PUT',
    data: modifyFormData
  })
}
// 删除用户
export function deleteUserRequest(myid) {
  return Request({
    url: `users/${myid}`,
    method: 'delete'
  })
}
