// 本地代理前缀
export const PROXY_PREFIX = process.env.NODE_ENV === 'development' ? '/wz' : '';
export const PROXY_PREFIX_LOGIN = process.env.NODE_ENV === 'development' ? '/wz' : '';

// 服务器操作
export const SERVER_OPERATION = {
  START: 1,
  STOP: 2,
  REBOOT: 3,
};
