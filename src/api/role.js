import Request from '../utils/request'

// 获取角色数据
export function getRolesDataRequest() {
  return Request({
    url: 'roles',
    method: 'get'
  })
}

// 添加角色
export function addRoleRequest(addRoleFormData) {
  return Request({
    url: 'roles',
    method: 'post',
    data: addRoleFormData
  })
}

// 修改角色信息
export function modifyRoleRequest(editRoleData) {
  return Request({
    url: `roles/${editRoleData.id}`,
    method: 'put',
    data: editRoleData
  })
}

// 删除角色
export function deleteRoleRequest(id) {
  return Request({
    url: `roles/${id}`,
    method: 'delete'
  })
}
// 分配角色
export function allotRolesRequest(userInfo, selectedRoleId) {
  return Request({
    url: `users/${userInfo.id}/role`,
    method: 'put',
    data: {
      rid: selectedRoleId
    }
  })
}
