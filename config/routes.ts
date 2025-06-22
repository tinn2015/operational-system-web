/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'register-result',
        icon: 'smile',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: 'register',
        icon: 'smile',
        path: '/user/register',
        component: './user/register',
      },
      // {
      //   component: '404',
      //   path: '/*',
      // },
    ],
  },
  {
    path: '/dashboard',
    name: '门店看板',
    icon: 'dashboard',
    routes: [
      {
        path: '/dashboard',
        redirect: '/dashboard/analysis',
      },
      // {
      //   name: '运行状态',
      //   icon: 'smile',
      //   path: '/dashboard/status',
      //   component: './dashboard/status',
      // },
      {
        name: '分析',
        icon: 'smile',
        path: '/dashboard/analysis',
        component: './dashboard/analysis',
      },
      // {
      //   name: 'monitor',
      //   icon: 'smile',
      //   path: '/dashboard/monitor',
      //   component: './dashboard/monitor',
      // },
      // {
      //   name: 'workplace',
      //   icon: 'smile',
      //   path: '/dashboard/workplace',
      //   component: './dashboard/workplace',
      // },
    ],
  },
  {
    path: '/userCenter',
    name: '用户管理',
    icon: 'smile',
    routes: [
      {
        path: '/userCenter',
        redirect: '/userCenter/userList',
      },
      {
        name: '用户列表',
        icon: 'smile',
        path: '/userCenter/userList',
        component: './userCenter/userList',
      },
      {
        name: '角色管理',
        icon: 'smile',
        path: '/userCenter/roleList',
        component: './userCenter/roleList',
      },
      {
        name: '权限管理',
        icon: 'smile',
        path: '/userCenter/permissionList',
        component: './userCenter/permissionList',
      },
    ],
  },
  {
    path: '/device',
    name: '设备管理',
    icon: 'smile',
    routes: [
      {
        path: '/device',
        redirect: '/device/headset',
      },
      {
        name: '头显管理',
        icon: 'smile',
        path: '/device/headset',
        component: './device/headset',
      },
      {
        name: '服务器管理',
        icon: 'smile',
        path: '/device/server',
        component: './device/server',
      },
    ],
  },
  {
    path: '/device/serverCenter',
    name: '服务中心',
    icon: 'smile',
    routes: [
      {
        path: '/device/serverCenter',
        redirect: '/device/serverCenter/streaming',
      },
      {
        name: '串流服务',
        icon: 'smile',
        path: '/device/serverCenter/streaming',
        component: './device/serverCenter/streaming',
      },
      {
        name: '游戏client',
        icon: 'smile',
        path: '/device/serverCenter/gameClient',
        component: './device/serverCenter/gameClient',
      },
      {
        name: '游戏server',
        icon: 'smile',
        path: '/device/serverCenter/gameServer',
        component: './device/serverCenter/gameServer',
      },
      {
        name: '位姿总服务器',
        icon: 'smile',
        path: '/device/serverCenter/poseHub',
        component: './device/serverCenter/poseHub',
      },
      {
        name: '位姿子服务器',
        icon: 'smile',
        path: '/device/serverCenter/pose',
        component: './device/serverCenter/pose',
      },
    ],
  },
  {
    path: '/products',
    name: '商品管理',
    icon: 'smile',
    routes: [
      {
        path: '/products',
        redirect: '/products/list',
      },
      {
        name: '商品列表',
        icon: 'smile',
        path: '/products/list',
        component: './products/index',
      },
    ],
  },
  {
    path: '/ticket',
    name: '票务管理',
    icon: 'smile',
    routes: [
      {
        path: '/ticket',
        redirect: '/ticket/list',
      },
      {
        name: '报表统计',
        icon: 'smile',
        path: '/ticket/report',
        component: './ticket/report',
      },
      {
        name: '票务列表',
        icon: 'smile',
        path: '/ticket/list',
        component: './ticket/index',
      },
      {
        name: 'SKU管理',
        icon: 'smile',
        path: '/ticket/sku',
        component: './ticket/sku',
      },
      {
        name: '预约管理',
        icon: 'smile',
        path: '/ticket/appointment',
        component: './ticket/appointment',
      },
      {
        name: '订单管理',
        icon: 'smile',
        path: '/ticket/order',
        component: './ticket/order',
      },
      {
        name: '财务管理',
        icon: 'smile',
        path: '/ticket/finance',
        component: './ticket/finance',
      },
    ],
  },
  {
    path: '/game',
    name: '游戏管理',
    icon: 'smile',
    routes: [
      {
        path: '/game',
        redirect: '/game/checkIn',
      },
      {
        name: '签到管理',
        icon: 'smile',
        path: '/game/checkIn',
        component: './game/checkIn',
      },
      {
        name: '组队管理',
        icon: 'smile',
        path: '/game/team',
        component: './game/team',
      },
      {
        name: '玩家管理',
        icon: 'smile',
        path: '/game/player',
        component: './game/player',
      },
    ],
  },
  {
    path: '/show',
    name: '放映管理',
    icon: 'smile',
    routes: [
      {
        path: '/show',
        redirect: '/show/content',
      },
      {
        name: '放映内容管理',
        icon: 'smile',
        path: '/show/content',
        component: './show/content',
      },
      {
        name: '放映计划管理',
        icon: 'smile',
        path: '/show/plan',
        component: './show/plan',
      },
      {
        name: '秘钥管理',
        icon: 'smile',
        path: '/show/key',
        component: './show/key',
      },
    ],
  },
  {
    path: '/fire',
    name: '消防告警',
    icon: 'smile',
    routes: [
      {
        path: '/fire',
        redirect: '/fire/list',
      },
      {
        name: '告警列表',
        icon: 'smile',
        path: '/fire/list',
        component: './fire/list',
      },
    ],
  },
  {
    path: '/marketing',
    name: '营销相关',
    icon: 'smile',
    routes: [
      {
        path: '/marketing',
        redirect: '/marketing/coupon',
      },
      {
        name: '优惠券管理',
        icon: 'smile',
        path: '/marketing/coupon',
        component: './marketing/coupon',
      },
      {
        name: '用户反馈',
        icon: 'smile',
        path: '/marketing/feedback',
        component: './marketing/feedback',
      },
    ],
  },
  {
    name: 'exception',
    icon: 'warning',
    path: '/exception',
    hideInMenu: true,
    routes: [
      {
        path: '/exception',
        redirect: '/exception/403',
      },
      {
        name: '403',
        icon: 'smile',
        path: '/exception/403',
        component: './exception/403',
      },
      {
        name: '404',
        icon: 'smile',
        path: '/exception/404',
        component: './exception/404',
      },
      {
        name: '500',
        icon: 'smile',
        path: '/exception/500',
        component: './exception/500',
      },
    ],
  },
  {
    name: 'account',
    icon: 'user',
    path: '/account',
    hideInMenu: true,
    routes: [
      {
        path: '/account',
        redirect: '/account/center',
      },
      // {
      //   name: 'center',
      //   icon: 'smile',
      //   path: '/account/center',
      //   component: './account/center',
      // },
      // {
      //   name: 'settings',
      //   icon: 'smile',
      //   path: '/account/settings',
      //   component: './account/settings',
      // },
      {
        name: 'password',
        icon: 'smile',
        path: '/account/password',
        component: './account/password',
      },
    ],
  },
  {
    path: '/log',
    name: '日志管理',
    icon: 'smile',
    routes: [
      {
        path: '/log',
        redirect: '/log/server',
      },
      {
        name: '服务日志',
        icon: 'smile',
        path: '/log/server',
        component: './log/server',
      },
      {
        name: '游戏日志',
        icon: 'smile',
        path: '/log/game',
        component: './log/game',
      },
      {
        name: '设备日志',
        icon: 'smile',
        path: '/log/device',
        component: './log/device',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard/analysis',
  },
  {
    path: '/wz-admin',
    redirect: '/dashboard/analysis',
  },
  {
    component: '404',
    path: '/*',
  },
];
