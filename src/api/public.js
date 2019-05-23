import request from '@/utils/request'

/**
 * 获取文件上传的token
 */
export function uploadToken() {
  return request({
    url: '/mall/public/uploadToken',
    method: 'get'
  })
}
