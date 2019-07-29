import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params: params
  })
}

export function closeOrder(params) {
  return request({
    url: '/order/update/close',
    method: 'post',
    params: params
  })
}

export function deleteOrder(params) {
  return request({
    url: '/order/delete',
    method: 'post',
    params: params
  })
}

export function deliveryOrder(data) {
  return request({
    url: '/order/update/delivery',
    method: 'post',
    data: data
  });
}

export function getOrderDetail(id) {
  return request({
    url: '/order/' + id,
    method: 'get'
  });
}

export function updateReceiverInfo(data) {
  return request({
    url: '/order/update/receiverInfo',
    method: 'post',
    data: data
  });
}

export function updateMoneyInfo(data) {
  return request({
    url: '/order/update/moneyInfo',
    method: 'post',
    data: data
  });
}

export function updateOrderNote(params) {
  return request({
    url: '/order/update/note',
    method: 'post',
    params: params
  })
}

/**
 * 获取订单详情:订单信息、商品信息
 */
export function orderDetail(id) {
  return request({
    url: `/mall/admin/order/${id}`,
    method: 'get',
  })
}

/**
 * 获取订单列表
 * @param data
 */
export function orderList(data) {
  return request({
    url: '/mall/admin/order/list',
    method: 'post',
    data: {
      pageNo: data.pageNo - 1,
      pageSize: data.pageSize,
      orderNo: data.orderNo,
      receiverName: data.receiverName,
      receiverPhone: data.receiverPhone,
      status: data.status,
      createTime: data.createTime
    }
  })
}

/**
 * 批量删除订单
 * @param ids
 */
export function orderDelete(ids) {
  return request({
    url: '/mall/admin/order/delete',
    method: 'post',
    data: ids
  })
}

/**
 * 批量关闭订单
 * @param ids
 */
export function orderClose(ids) {
  return request({
    url: '/mall/admin/order/update/close',
    method: 'post',
    data: ids
  })
}
/**
 * 批量发货
 * @param ids
 */
export function orderDelivery(ids) {
  return request({
    url: '/mall/admin/order/update/delivery',
    method: 'post',
    data: ids
  })
}

/**
 * 备注订单
 */
export function orderUpdateNote(id, note, status) {
  return request({
    url: '/mall/admin/order/update/note',
    method: 'post',
    data: {
      id,
      note,
      status
    }
  })
}

/**
 * 修改订单费用信息
 * @param data
 */
export function orderUpdateReceiverInfo(data) {
  return request({
    url: '/mall/admin/order/update/moneyInfo',
    method: 'post',
    data: data
  })
}

/**
 * 确认收货
 * @param id
 */
export function confirmReceiveGood(id) {
  return request({
    url: `/mall/admin/order/update/confirmReceiveGood/${id}`,
    method: 'get',
  })
}


