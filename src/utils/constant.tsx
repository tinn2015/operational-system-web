// 本地代理前缀
export const PROXY_PREFIX = process.env.NODE_ENV === 'development' ? '/wz' : '';
export const PROXY_PREFIX_LOGIN = process.env.NODE_ENV === 'development' ? '/wz' : '';

// 服务器操作
export const SERVER_OPERATION = {
  START: 1,
  STOP: 2,
  REBOOT: 3,
};

// 角色类型
export const ROLE_TYPE = {
  // SYSTEM_ADMIN: {
  //   label: '系统管理员',
  //   id: 0,
  // },
  CORP_ADMIN: {
    label: '企业管理员',
    id: 1,
  },
  VENUE_ADMIN: {
    label: '场馆管理员',
    id: 2,
  },
  USER: {
    label: '普通用户',
    id: 3,
  },
};
