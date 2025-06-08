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
    path: '/game',
    name: '游戏管理',
    icon: 'smile',
    routes: [
      {
        path: '/game',
        redirect: '/game/team',
      },
      {
        name: '组队管理',
        icon: 'smile',
        path: '/game/team',
        component: './game/team',
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
    path: '/',
    redirect: '/dashboard/analysis',
  },
  {
    component: '404',
    path: '/*',
  },
];
