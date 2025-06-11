import { PROXY_PREFIX_LOGIN } from '@/utils/constant';
import { request } from '@umijs/max';

/**
 * 获取玩家列表
 * @param options
 * @returns
 */
export async function getPlayerList(options?: { [key: string]: any }) {
    return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/control/game/user/page`, {
        method: 'GET',
        params: options,
    });
}
