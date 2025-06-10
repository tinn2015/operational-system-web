import { request } from '@umijs/max';
import { PROXY_PREFIX } from '@/utils/constant';


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
    }>(`${PROXY_PREFIX}/admin/products/getPageList`, {
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
    return request<API.Product>(`${PROXY_PREFIX}/admin/product/save`, {
        method: 'POST',
        data: {
            data,
            listingList,
        },
    });
}

/** 删除商品 */
export async function deleteProduct(productId: string) {
    return request<Record<string, any>>(`${PROXY_PREFIX}/admin/product/delete/${productId}`, {
        method: 'DELETE',
    });
}

/** 更新商品状态 */
export async function updateProductStatus(productId: string, status: number) {
    return request<Record<string, any>>(`${PROXY_PREFIX}/admin/product/status`, {
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
    }>(`${PROXY_PREFIX}/admin/product/upload`, {
        method: 'POST',
        data: formData,
        requestType: 'form',
    });
} 