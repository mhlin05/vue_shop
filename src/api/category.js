import Request from '../utils/request'
// 获取分类数据
// export function getCateDataRequest() {
//   return Request({
//     url: 'categories',
//     method: 'get'
//   })
// }
// 获取分页的分类数据
export function getCateDataRequest(queryInfo) {
  if (queryInfo) {
    return Request({
      url: 'categories',
      method: 'get',
      params: queryInfo
    })
  } else {
    return Request({
      url: 'categories',
      method: 'get'
    })
  }
}
// 获取父级分类数据
export function getParentsCateDataRequest() {
  return Request({
    url: 'categories',
    method: 'get',
    params: {
      type: 2
    }
  })
}
// 根据分类 获取商品参数
export function getCateAttributesRequest(selectedId, mysel) {
  return Request({
    url: `categories/${selectedId}/attributes`,
    method: 'get',
    params: { sel: mysel }
  })
}
// 添加分类
export function addCateRequest(addCateFormData) {
  return Request({
    url: 'categories',
    method: 'post',
    data: addCateFormData
  })
}
// 编辑分类
export function editCateRequest(editCateData) {
  return Request({
    url: 'categories/' + editCateData.categoriesId,
    method: 'put',
    data: { cat_name: editCateData.categoriesName }
  })
}
// 删除分类
export function deleteCateRequest(id) {
  return Request({
    url: `categories/${id}`,
    method: 'delete'
  })
}
