import { PROXY_PREFIX } from '@/utils/constant';
import { request } from '@umijs/max';

/** 获取商品列表 */
export async function getProductList(params: {
  pageSize?: number;
  pageNum?: number;
  productName?: string;
  saleStatus?: number;
}) {
  return request<{
    count: number;
    items: API.Product[];
  }>(`${PROXY_PREFIX}/ticket/products/getPageList`, {
    method: 'GET',
    params,
  });
}

/** 保存商品 */
export async function saveProduct(data: API.Product, listingList: API.timeRange[]) {
  const _data = {
    ...data,
    listingList,
  };
  return request<API.Product>(`${PROXY_PREFIX}/ticket/products/saveProduct`, {
    method: 'POST',
    data: _data,
  });
}
/** 商品上架 */
export async function onSaleProduct(productId: string) {
  return request<Record<string, any>>(`${PROXY_PREFIX}/ticket/products/${productId}/on-sale`, {
    method: 'POST',
  });
}

/** 商品下架 */
export async function offSaleProduct(productId: string) {
  return request<Record<string, any>>(`${PROXY_PREFIX}/ticket/products/${productId}/off-sale`, {
    method: 'POST',
  });
}

/** 删除商品 */
export async function deleteProduct(productId: string) {
  return request<Record<string, any>>(`${PROXY_PREFIX}/ticket/products/${productId}`, {
    method: 'DELETE',
  });
}
/** 获取已经上架的游戏 */
export async function getRecentProducts() {
  return request<API.Product[]>(`${PROXY_PREFIX}/ticket/products/getRecentProducts`, {
    method: 'GET',
  });
}

/** 更新商品状态 */
export async function updateProductStatus(productId: string, status: number) {
  return request<Record<string, any>>(`${PROXY_PREFIX}/ticket/products/status`, {
    method: 'PUT',
    data: {
      productId,
      status,
    },
  });
}

/** 上传商品图片 */
export async function uploadProductImage(formData: FormData) {
  return request<{
    url: string;
  }>(`${PROXY_PREFIX}/ticket/products/upload`, {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
}
