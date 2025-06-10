import { PROXY_PREFIX } from '@/utils/constant';
import { request } from '@umijs/max';

/** 获取商品列表 */
export async function getProductList(params: {
  pageSize?: number;
  pageIndex?: number;
  productName?: string;
  saleStatus?: number;
}) {
  return request<{
    count: number;
    items: API.Product[];
  }>(`${PROXY_PREFIX}/ticket/products/getPageList`, {
    method: 'GET',
    params: {
      ...params,
      pageSize: params.pageSize,
      pageIndex: params.pageIndex || 1,
    },
  });
}

/** 保存商品 */
export async function saveProduct(data: API.Product, listingList: API.timeRange[]) {
  return request<API.Product>(`${PROXY_PREFIX}/ticket/products/saveProduct`, {
    method: 'POST',
    data: {
      product: data,
      listingList,
    },
  });
}

/** 删除商品 */
export async function deleteProduct(productId: string) {
  return request<Record<string, any>>(`${PROXY_PREFIX}/ticket/products/delete/${productId}`, {
    method: 'DELETE',
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
