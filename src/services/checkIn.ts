import { PROXY_PREFIX } from '@/utils/constant';
import { request } from '@umijs/max';

/** 获取玩家签到码 */
export async function getPlayerCheckinCode(options: {
  productId: string;
  listingId: string;
  quantity: number;
}) {
  return request<string[]>(`${PROXY_PREFIX}/ticket/checkIn/createQrCode`, {
    method: 'POST',
    data: options,
  });
}
