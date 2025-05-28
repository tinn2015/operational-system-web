// @ts-ignore
/* eslint-disable */
/**
 * @file 用户管理相关接口
 * @description 包含服务器列表的增删改查等操作接口
 * - getDeviceList: 获取服务器列表
 * - saveDevice: 添加/修改服务器
 * - deleteDevice: 删除服务器
 * - updateDevice: 操作服务器(启动/停止等)
 */

import { PROXY_PREFIX_LOGIN } from '@/utils/constant';
import { request } from '@umijs/max';

/**
 * 获取服务器列表
 * @param options
 * @returns
 */
export async function getUserList(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/admin/user/getUserPageList`, {
    method: 'POST',
    data: options,
    // ...(options || {}),
  });
}

/** 添加或者修改服务器列表 */
export async function saveUser(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/admin/user/saveUserInfo`, {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

/** 删除服务器 */
export async function deleteUser(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/admin/user/deleteByUserId`, {
    method: 'GET',
    params: {
      ...(options || {}),
    },
  });
}
/**
 * 更新密码
 */
export async function updatePassword(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/admin/user/updatePassword`, {
    method: 'POST',
    data: { ...(options || {}) },
  });
}
