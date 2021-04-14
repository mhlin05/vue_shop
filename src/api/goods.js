import Request from '../utils/request'

// 添加商品
export function addGoodsRequest(form) {
  return Request({
    url: 'goods',
    method: 'post',
    data: form
  })
}
//   获取商品列表
export function getGoodsListRequest(queryInfo) {
  return Request({
    url: 'goods',
    method: 'get',
    params: queryInfo
  })
}
//   删除商品
export function deleteGoodsRequest(id) {
  return Request({
    url: `goods/${id}`,
    method: 'delete'
  })
}
