// @ts-ignore
/* eslint-disable */
/**
 * @file 服务器管理相关接口
 * @description 包含服务器列表的增删改查等操作接口
 * - getDeviceList: 获取服务器列表
 * - saveDevice: 添加/修改服务器
 * - deleteDevice: 删除服务器
 * - updateDevice: 操作服务器(启动/停止等)
 */

import { PROXY_PREFIX } from '@/utils/constant';
import { request } from '@umijs/max';

/**
 * 获取服务器列表
 * @param options
 * @returns
 */
export async function getDeviceList(options?: { [key: string]: any }) {
  return request<API.DeviceList>(`${PROXY_PREFIX}/control/device/page`, {
    method: 'GET',
    params: options,
    // ...(options || {}),
  });
}

/** 添加或者修改服务器列表 */
export async function saveDevice(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX}/control/device/save`, {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

/** 删除服务器 */
export async function deleteDevice(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX}/control/device/del/${options?.id}`, {
    method: 'DELETE',
  });
}

/** 操作服务器 */
export async function rebootDevice(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX}/device/reboot/${options?.id}`, {
    method: 'PUT',
    params: {
      ...(options || {}),
    },
  });
}
