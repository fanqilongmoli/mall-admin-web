import request from '@/utils/request'

export function fetchList(parentId, params) {
  return request({
    url: '/productCategory/list/' + parentId,
    method: 'get',
    params: params
  })
}

export function deleteProductCate(id) {
  return request({
    url: '/productCategory/delete/' + id,
    method: 'post'
  })
}

export function createProductCate(data) {
  return request({
    url: '/productCategory/create',
    method: 'post',
    data: data
  })
}

export function updateProductCate(id, data) {
  return request({
    url: '/productCategory/update/' + id,
    method: 'post',
    data: data
  })
}

export function getProductCate(id) {
  return request({
    url: '/productCategory/' + id,
    method: 'get',
  })
}

export function updateShowStatus(data) {
  return request({
    url: '/productCategory/update/showStatus',
    method: 'post',
    data: data
  })
}

export function updateNavStatus(data) {
  return request({
    url: '/productCategory/update/navStatus',
    method: 'post',
    data: data
  })
}

export function fetchListWithChildren() {
  return request({
    url: '/productCategory/list/withChildren',
    method: 'get'
  })
}

/**
 * 获取商品分类数据
 */
export function getProductCateList() {
  return request({
    url: '/mall/admin/category/all/list',
    method: 'get'
  })
}

/**
 * 添加新的商品分类
 * @param data
 */
export function saveCate(data) {
  return request({
    url: '/mall/admin/category/save',
    method: 'post',
    data: data
  })
}

/**
 * 根据 id 获取详情
 * @param id
 */
export function getCateDetail(id) {
  return request({
    url: `/mall/admin/category/${id}`,
    method: 'get'
  })
}

/**
 * 删除商品分类
 * @param list
 */
export function deleteCate(list) {
  return request({
    url: `/mall/admin/category/delete`,
    method: 'post',
    data: list
  })
}

/**
 * 获取所有一级分类
 */
export function getProductCateRootList() {
  return request({
    url: '/mall/admin/category/root/list',
    method: 'get'
  })
}
