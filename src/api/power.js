import Request from '@/utils/request'

// 获取权限列表
export function getRightsRequest() {
  return Request({
    url: 'rights/list',
    method: 'get'
  })
}
// 获取权限列表 树状
export function getRightsTreeRequest() {
  return Request({
    url: 'rights/tree',
    method: 'get'
  })
}
// 根据id删除对应权限
export function deletePowerAsId(role, rightId) {
  return Request({
    url: `roles/${role.id}/rights/${rightId}`,
    method: 'delete'
  })
}
// 分配权限
export function allotRightsRequest(roleId, idStr) {
  return Request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids: idStr }
  })
}
