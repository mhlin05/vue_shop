import Request from '../utils/request'

// 获取参数列表
export function getParamsListRequest(selectedId, activeName) {
  return Request({
    url: `categories/${selectedId}/attributes`,
    method: 'get',
    params: {
      sel: activeName
    }
  })
}
// 添加参数
export function addParamsRequest(selectedKey, attrName, activeName) {
  return Request({
    url: `categories/${selectedKey}/attributes`,
    method: 'post',
    data: {
      attr_id: selectedKey,
      attr_name: attrName,
      attr_sel: activeName
    }
  })
}
// 修改参数
export function editParamsRequest(selectedKey, editFormData) {
  return Request({
    url: `categories/${selectedKey}/attributes/${editFormData.attrId}`,
    method: 'put',
    data: editFormData
  })
}
// 删除参数
export function deleteParamsRequest(selectedKey, id) {
  return Request({
    url: `categories/${selectedKey}/attributes/${id}`,
    method: 'delete'
  })
}
