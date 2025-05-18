// @ts-ignore
/* eslint-disable */
import { PROXY_PREFIX } from '@/utils/constant';
import { request } from '@umijs/max';

/**
 * 获取服务器列表
 * @param options
 * @returns
 */
export async function getServerList(options?: { [key: string]: any }) {
  return request<API.ServerList>(`${PROXY_PREFIX}/server/page`, {
    method: 'GET',
    params: options,
    // ...(options || {}),
  });
}

/** 添加或者修改服务器列表 */
export async function saveServer(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX}/server/save`, {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

/** 删除服务器 */
export async function deleteServer(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX}/server/del/${options?.id}`, {
    method: 'DELETE',
  });
}

/** 操作服务器 */
export async function updateServer(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX}/server/operate`, {
    method: 'PUT',
    params: {
      ...(options || {}),
    },
  });
}
