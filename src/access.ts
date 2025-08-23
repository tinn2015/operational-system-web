/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(
  initialState: { currentUser?: API.CurrentUser; userPermission?: API.UserPermission } | undefined,
) {
  const { currentUser, userPermission } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    // 是否有后台启动游戏权限
    serverStartBtn: userPermission?.gameProf,
  };
}
