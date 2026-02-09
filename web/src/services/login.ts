// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取图形验证码 GET /api/captcha */
export async function getCaptcha(options?: { [key: string]: any }) {
  return request<{
    code: number;
    msg: string;
    data?: {
      captchaId: string;
      /** 后端返回的 Base64 图片内容 */
      captchaImage: string;
    };
  }>('/api/captcha', {
    method: 'GET',
    ...(options || {}),
  });
}
