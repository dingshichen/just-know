// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 登录日志选项
 */
export class LoginLogOption {
  logId: string;
  loginAccount: string;
  constructor(logId: string, loginAccount: string) {
    this.logId = logId;
    this.loginAccount = loginAccount;
  }
}

/**
 * 登录日志列表项
 * 对应后端的 LoginLogItem DTO
 */
export class LoginLogItem extends LoginLogOption {
  loginUserId?: string;
  ip?: string;
  browser?: string;
  device?: string;
  loginActionType?: string;
  createdTime?: string;
}

/**
 * 登录日志分页查询参数
 * 对应后端的 LoginLogPageQuery + PageQuery
 */
export type LoginLogPageParams = {
  pageNum?: number;
  pageSize?: number;
  loginAccount?: string;
  loginActionType?: string;
  startTime?: string;
  endTime?: string;
};

type Result<T> = {
  code: number;
  msg: string;
  data: T;
};

type PageInfo<T> = {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
};

/**
 * 分页查询登录日志
 * GET /api/login-log/page
 */
export async function pageLoginLogs(params: LoginLogPageParams) {
  return request<Result<PageInfo<LoginLogItem>>>('/api/login-log/page', {
    method: 'GET',
    params,
  });
}

