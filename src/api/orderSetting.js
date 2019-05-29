import request from '@/utils/request'
// export function getOrderSetting(id) {
//   return request({
//     url:'/orderSetting/'+id,
//     method:'get',
//   })
// }
//
// export function updateOrderSetting(id,data) {
//   return request({
//     url:'/orderSetting/update/'+id,
//     method:'post',
//     data:data
//   })
// }

/**
 * 获取订单设置
 * @param id
 */
export function getOrderSetting(id) {
  return request({
    url: `/mall/admin/orderSetting/${id}`,
    method: 'get'
  })
}

/**
 * 修改指定订单设置
 * @param data
 */
export function saveOrderSetting(data) {
  return request({
    url: '/mall/admin/orderSetting/save',
    method: 'post',
    data: data
  })
}
