import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/product/list',
    method: 'get',
    params: params
  })
}

export function fetchSimpleList(params) {
  return request({
    url: '/product/simpleList',
    method: 'get',
    params: params
  })
}

export function updateDeleteStatus(params) {
  return request({
    url: '/product/update/deleteStatus',
    method: 'post',
    params: params
  })
}

export function updateNewStatus(params) {
  return request({
    url: '/product/update/newStatus',
    method: 'post',
    params: params
  })
}

export function updateRecommendStatus(params) {
  return request({
    url: '/product/update/recommendStatus',
    method: 'post',
    params: params
  })
}

export function updatePublishStatus(params) {
  return request({
    url: '/product/update/publishStatus',
    method: 'post',
    params: params
  })
}

export function createProduct(data) {
  return request({
    url: '/product/create',
    method: 'post',
    data: data
  })
}

export function updateProduct(id, data) {
  return request({
    url: '/product/update/' + id,
    method: 'post',
    data: data
  })
}

export function getProduct(id) {
  return request({
    url: '/product/updateInfo/' + id,
    method: 'get',
  })
}

/**
 * 获取商品列表
 * @param pageNo
 * @param pageSize
 * @param name
 * @param categoryId
 * @param status
 */
export function getProductList(pageNo, pageSize, name, categoryId, status) {
  return request({
    url: '/mall/admin/product/list',
    method: 'post',
    data: {
      pageNo, pageSize, name, categoryId, status
    }
  })
}

