import request from '@/utils/request'

/**
 * 获取商品列表 草稿
 * @param data
 */
export function getProductList(data) {
  return request({
    url: '/mall/admin/productTemp/list',
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
 * 保存修改商品
 * @param data
 */
export function saveProduct(data) {

  const tempData = Object.assign({}, data);
  tempData.categoryId = tempData.categoryId ? tempData.categoryId[1] : null
  let subImagesStr = '';
  tempData.subImages.forEach(item => {
    subImagesStr += `${item},`
  });
  tempData.subImages = subImagesStr;
  return request({
    url: 'mall/admin/productTemp',
    method: 'post',
    data: tempData
  })
}

/**
 * 获取商品详情
 * @param id
 */
export function getDetail(id) {
  return request({
    url: `mall/admin/productTemp/${id}`,
    method: 'get',
  })
}

/**
 * 删除商品
 * @param data
 */
export function deleteProduct(data) {
  return request({
    url: '/mall/admin/productTemp/delete',
    method: 'post',
    data: data
  })
}
