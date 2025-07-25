﻿import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { message, notification } from 'antd';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  code: number;
  message: string;
  errorInfo: string;
  data: any;
  success: boolean;
  errorCode: string;
  errorMessage: string;
  showType: ErrorShowType;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;

      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const token = localStorage.getItem('token');
      const authHeader: Record<string, string> = {
        // Authorization: 'Bearer ' + localStorage.getItem('token'),
        // Authorization:
        //   'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ0ZW5hbnRJZExpc3QiOlsiUTE1RElLQ0sxeCJdLCJjb3JwSWQiOiJEOGNBMDZwdm5zIiwidXNlck5hbWUiOiJKb2UgQmFybmVzIiwidXNlcklkIjoiMSIsImV4cCI6MTc1NTg1NjM2Mn0.RDzTD9m0UbGiVSS0zVelvn91b4tbMNs-dzEw4AfwWxDM3a77CMk5m9xCk_oF-UwPorefyJIMb2eg3emAfN3jYb23yxfDiI7Lf7eFZUXmtIZX4uO6SRfy-4SXxUKzWwCDHuMHeEzA7VNFkuoRzKhYcZHm-pk-nlt2xsQUOhjrCaknoVkMCEQVBQm0gNVLkJgkz6XsQLmR3qZ3bu6dhoonM0yS95lK4negHY35f1tofL5KhtdEJIWbKn_7RE-ef_yzO_OBpAvkPMkC1hy4HZUM-BCngjs67Pp3PJwPp7EyeFbevWAARXhmz_kp8cfoByTdlE4JqjPo2PvSmyOXnie1qg',
        Authorization: token ? 'Bearer ' + token : '',
        'X-Venue-Id': localStorage.getItem('X-Venue-Id') || '',
        'X-App-Code': 'Web_Manager',
      };
      console.log('requestInterceptors', config);
      // const url = config?.url?.concat('?token = 123');
      return { ...config, headers: authHeader };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;
      console.log('[response]', response.request.responseURL, response);
      const { code, errorInfo, message: msg } = data;
      if (code === 401) {
        history.push('/user/login');
        return false;
      }
      // 账号密码错误
      if (code === 100002) {
        message.error(errorInfo || msg);
        return data
      }
      if (code !== 200) {
        message.error(errorInfo || msg);
        return false;
      }
      if (code === 200) {
        return data;
      }

      return response;
    },
  ],
};
