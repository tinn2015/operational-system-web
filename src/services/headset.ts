// @ts-ignore
/* eslint-disable */
import { PROXY_PREFIX } from '@/utils/constant';
import { request } from '@umijs/max';

/**
 * 获取头显列表
 * @param options
 * @returns
 */
export async function getHeadsetList(options?: { [key: string]: any }) {
  return request<API.HeadsetList>(`${PROXY_PREFIX}/headset/page`, {
    method: 'GET',
    params: options,
    // ...(options || {}),
  });
}

/** 添加或者修改头显 */
export async function saveHeadsetList(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX}/headset/save`, {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

/** 删除头显 */
export async function deleteHeadset(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX}/headset/del/${options?.id}`, {
    method: 'DELETE',
  });
}
