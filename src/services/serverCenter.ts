import { PROXY_PREFIX } from '@/utils/constant';
import { request } from '@umijs/max';

/** 获取服务列表 */
export async function getServerList(params: Record<string, any>) {
  return request<API.ServerCenter>(`${PROXY_PREFIX}/control/server/page`, {
    method: 'GET',
    params,
  });
}

/** 操作服务 */
export async function operateServer(params: Record<string, any>) {
  return request<API.ServerCenter>(`${PROXY_PREFIX}/control/server/operate`, {
    method: 'PUT',
    params,
  });
}
