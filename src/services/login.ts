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

import { PROXY_PREFIX_LOGIN } from '@/utils/constant';
import { request } from '@umijs/max';

/**
 * 获取服务器列表
 * @param options
 * @returns
 */
export async function login(options?: { [key: string]: any }) {
    return request<API.LoginResult>(`${PROXY_PREFIX_LOGIN}/admin/login`, {
        method: 'POST',
        data: {
            ...(options || {}),
        },
    });
}

/** 获取登录用户信息 */
export async function getUserInfo(options?: { [key: string]: any }) {
    return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/admin/api/getLoginUserInfo`, {
        method: 'GET',
    });
}

/** 获取验证码 */
export async function getCaptcha(options?: { [key: string]: any }) {
    return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/admin/captchas/images`, {
        method: 'GET',
        params: {
            ...(options || {}),
        },
    });
}
