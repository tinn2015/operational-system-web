import { PROXY_PREFIX_LOGIN } from '@/utils/constant';
import { request } from '@umijs/max';

// 一些公共接口

/**
 * 上传文件
 * @param options
 * @returns
 */
export async function uploadFile(options?: { [key: string]: any }, params?: { [key: string]: any }) {
    return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/admin/file/upload`, {
        method: 'POST',
        params,
        data: options,
    });
}

/**
 * 删除文件
 * @param fileUrl 文件URL
 * @returns 
 */
export async function deleteFile(fileUrl: string) {
    return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/admin/file/remove`, {
        method: 'DELETE',
        params: { filePaths: fileUrl },
    });
}

