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
 * @param data
 */
export function getProductList(data) {
  return request({
    url: '/mall/admin/product/list',
    method: 'post',
    data: {
      name: data.name,
      pageNo: data.pageNo - 1,
      pageSize: data.pageSize,
      status: data.status,
      categoryId: data.categoryId ? data.categoryId[1] : null,
    }
  })
}

/**
 * 删除商品
 * @param data
 */
export function deleteProduct(data) {
  return request({
    url: '/mall/admin/product/delete',
    method: 'post',
    data: data
  })
}

/**
 * 保存修改商品
 * @param data
 */
export function saveProduct(data) {
  data.categoryId = data.categoryId ? data.categoryId[1] : null
  return request({
    url: 'mall/admin/product',
    method: 'post',
    data: data
  })
}

/**
 * 保存修改商品
 * @param data
 */
export function getDetail(id) {
  return request({
    url: `mall/admin/product/${id}`,
    method: 'get',
  })
}


