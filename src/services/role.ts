import { PROXY_PREFIX_LOGIN } from '@/utils/constant';
import { request } from '@umijs/max';

/**
 * 获取角色列表
 * @param options
 * @returns
 */
export async function getRoleList(options?: { [key: string]: any }) {
    return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/admin/role/getPageList`, {
        method: 'GET',
        params: options,
    });
}

/**
 * 获取角色列表(院线)
 * @param options
 * @returns
 */
export async function getRoleListForCorp(options?: { [key: string]: any }) {
    return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/admin/role/getRoleListForCorp`, {
        method: 'GET',
        params: options,
    });
}

/**
 * 添加或修改角色
 * @param options
 * @returns
 */
export async function saveRole(options?: { [key: string]: any }) {
    return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/admin/role/saveRole`, {
        method: 'POST',
        data: {
            ...(options || {}),
        },
    });
}

/**
 * 删除角色
 * @param options
 * @returns
 */
export async function deleteRole(options?: { [key: string]: any }) {
    return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/admin/role/delete/${options?.roleId}`, {
        method: 'DELETE',
    });
} 