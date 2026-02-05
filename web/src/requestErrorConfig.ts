import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { notification } from 'antd';

const loginPath = '/user/login';

/** 当前是否为登录页（或注册等无需登录的页面） */
const isLoginPage = () => {
  const path = history.location?.pathname || window.location.pathname;
  return [loginPath, '/user/register', '/user/register-result'].includes(path);
};

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
        // HTTP 401/403 视为认证失败：非登录页静默跳转登录页，登录页才弹错
        const status = error.response.status;
        if (status === 401 || status === 403) {
          if (!isLoginPage()) {
            history.push(loginPath);
            return;
          }
          showError('认证失败', error.response?.data?.msg || `响应状态: ${status}`);
          return;
        }
        // 其他 HTTP 错误照常提示
        showError('请求失败', `响应状态: ${status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        showError('请求失败', '未收到响应，请重试');
      } else {
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
        // 业务码 401 视为认证失败：非登录页静默跳转登录页，登录页才弹错
        if (res.code === 401) {
          if (!isLoginPage()) {
            history.push(loginPath);
            return response;
          }
          showError('认证失败', res.msg || '请重新登录');
          return response;
        }
        showError('请求失败', res.msg || '请求失败，请重试');
      }
      return response;
    },
  ],
};
