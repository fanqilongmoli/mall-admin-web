import request from '@/utils/request'

/**
 * 拣货统计
 */
export function pickingGoods(data) {
  return request({
    url: '/mall/admin/home/pickingGoods',
    method: 'post',
    data:{
      status: data.status,
      leftTime: data.createTime ? data.createTime[0] : "",
      rightTime: data.createTime ? data.createTime[1] : ""
    }
  })
}
