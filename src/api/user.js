import request from '@/utils/request'

export function list(data) {
  return request({
    url: `/mall/admin/user/list`,
    method: 'post',
    data: {
      pageNo: data.pageNo - 1,
      pageSize: data.pageSize,
      phone: data.phone,
      nickName: data.nickName
    }
  })
}

/**
 * 发送代金券
 * @param data
 */
export function sendCoupon(data) {
  return request({
    url: `/mall/pay/sendCoupon`,
    method: 'post',
    data
  })
}

/**
 * 发送平台优惠券
 * @param data
 */
export function sendPlatformCoupon(data) {
  return request({
    url: `/mall/admin/user/sendCoupon?couponId=${data.couponId}&userId=${data.userId}`,
    method: 'get'
  })
}

/**
 * 修改用户电话号码
 * @param data
 */
export function updatePhone(data) {
  return request({
    url: `mall/admin/user/update/phone`,
    method: 'post',
    data
  })
}

/**
 * 删除用户
 * @param id
 */
export function deleteUser(id) {
  return request({
    url: `mall/admin/user/${id}`,
    method: 'delete'
  })
}
