import Request from '../utils/request'

// 添加标签
export function addAttributeRequest(editFormData, vals) {
  return Request({
    url: `categories/${editFormData.id}/attributes/${editFormData.attrId}`,
    method: 'put',
    data: {
      attr_name: editFormData.attr_name,
      attr_sel: editFormData.attr_sel,
      attr_vals: vals
    }
  })
}
// 删除标签
export function deleteAttributeRequest(selectedId, activeName, row) {
  return Request({
    url: `categories/${selectedId}/attributes/${row.attr_id}`,
    method: 'put',
    data: {
      attr_name: row.attr_name,
      attr_sel: activeName,
      attr_vals: row.attr_vals.join(',')
    }
  })
}
