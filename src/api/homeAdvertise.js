import request from '@/utils/request'

/**
 * 获取banner列表
 */
export function fetchList() {
  return request({
    url: '/mall/banner',
    method: 'get'
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/home/advertise/update/status/' + id,
    method: 'post',
    params: params
  })
}

export function deleteHomeAdvertise(data) {
  return request({
    url: '/mall/banner/delete',
    method: 'post',
    data: data
  })
}

export function createHomeAdvertise(data) {
  return request({
    url: '/home/advertise/create',
    method: 'post',
    data: data
  })
}

/**
 * 获取banner详情
 * @param id
 */
export function getHomeAdvertise(id) {
  return request({
    url: `/mall/banner/${id}`,
    method: 'get',
  })
}

/**
 * 更新 banner数据
 * @param data
 */
export function updateHomeAdvertise(data) {
  return request({
    url: '/mall/banner',
    method: 'post',
    data: data
  })
}
