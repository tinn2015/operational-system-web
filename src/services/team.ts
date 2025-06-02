import { PROXY_PREFIX_LOGIN } from '@/utils/constant';
import { request } from '@umijs/max';

/**
 * 获取队伍列表
 * @param options
 * @returns
 */
export async function getTeamList(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/control/game/team/list`, {
    method: 'GET',
    params: options,
  });
}

/**
 * 获取队伍详情
 * @param options
 * @returns
 */
export async function getTeamDetail(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/control/game/team/detail`, {
    method: 'GET',
    params: options,
  });
}

/**
 * 添加或修改队伍
 * @param options
 * @returns
 */
export async function saveTeam(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/control/game/team/create`, {
    method: 'POST',
    data: {
      ...(options || {}),
    },
  });
}

/**
 * 退出队伍
 * @param options
 * @returns
 */
export async function quitTeam(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/control/game/team/quit`, {
    method: 'POST',
    data: options,
  });
}

/**
 * 添加玩家
 * @param options
 * @returns
 */
export async function joinTeam(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/control/game/team/join`, {
    method: 'POST',
    data: options,
  });
}

/**
 * 解散队伍
 * @param options
 * @returns
 */
export async function disbandTeam(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${PROXY_PREFIX_LOGIN}/control/game/team/disband`, {
    method: 'GET',
    params: options,
  });
}
