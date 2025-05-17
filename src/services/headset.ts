// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function getHeadsetList(options?: { [key: string]: any }) {
    return request<{
        data: API.HeadsetList;
    }>('/wz/headset/page', {
        method: 'GET',
        params: options,
        // ...(options || {}),
    });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
    return request<Record<string, any>>('/api/rule', {
        method: 'POST',
        data: {
            method: 'delete',
            ...(options || {}),
        },
    });
}
