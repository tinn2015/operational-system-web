import { PROXY_PREFIX_LOGIN } from '@/utils/constant';
import { request } from '@umijs/max';

/**
 * 获取玩家列表
 * @param options - 查询参数
 * - 多选参数格式：sexCode=1,2,3（逗号分隔的字符串）
 * - 文本搜索：nickName=张三
 * - 日期范围：beginDate=2023-01-01&endDate=2023-12-31
 * - 分页：pageNum=1&pageSize=10
 * @returns
 */
export async function getPlayerList(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/control/game/user/page`, {
    method: 'GET',
    params: options,
  });
}
