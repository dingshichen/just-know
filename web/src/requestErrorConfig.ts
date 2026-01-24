import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { notification } from 'antd';

// 在页面右上角展示错误提示
const showError = (title: string, description: string) => {
  notification.error({
    message: title,
    description,
    placement: 'topRight',
  });
};

const showWarning = (title: string, description: string) => {
  notification.warning({
    message: title,
    description,
    placement: 'topRight',
  });
};

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
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
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
              showWarning('提示', errorMessage || String(errorCode ?? ''));
              break;
            case ErrorShowType.ERROR_MESSAGE:
              showError('请求失败', errorMessage || String(errorCode ?? ''));
              break;
            case ErrorShowType.NOTIFICATION:
              showError(String(errorCode ?? '错误'), errorMessage || '');
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              showError('请求失败', errorMessage || String(errorCode ?? ''));
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        showError('请求失败', `响应状态: ${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        showError('请求失败', '未收到响应，请重试');
      } else {
        // 发送请求时出了点问题
        showError('请求失败', '请求异常，请重试');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 从本地存储中读取登录后的 JWT token，并通过 Header 传给后端
      const token = localStorage.getItem('jk-token');
      const headers = {
        ...(config.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      return { ...config, headers };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;

      if (data?.success === false) {
        showError('请求失败', (data as any)?.errorMessage || (data as any)?.msg || '请求失败，请重试');
      }
      return response;
    },
  ],
};
