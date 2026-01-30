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

// 与后端约定的响应数据格式（业务 Result 结构）
// 统一为：{ code, msg, data }
interface ResponseStructure<T = any> {
  code: number;
  msg: string;
  data: T;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误接收及处理（仅处理网络层/HTTP 错误，业务错误交给响应拦截器处理）
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      if (error.response) {
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
      // 拦截响应数据，统一处理业务层 Result 结构错误
      const { data } = response as { data: any };
      const res = data as Partial<ResponseStructure<any>>;

      if (typeof res.code === 'number' && res.code !== 0) {
        showError('请求失败', res.msg || '请求失败，请重试');
      }
      return response;
    },
  ],
};
