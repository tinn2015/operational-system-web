import { PROXY_PREFIX } from '@/utils/constant';
import { request } from '@umijs/max';

/** 获取玩家签到码 */
export async function getPlayerCheckinCode(options: {
    productId: string;
    sessionId: string;
    quantity: number;
}) {
    return request<Record<string, any>>(`${PROXY_PREFIX}/ticket/checkIn/createQrCode`, {
        method: 'POST',
        data: options,
    });
}
