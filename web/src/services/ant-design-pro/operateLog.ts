// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 操作日志列表项
 * 对应后端的 OperateLogItem DTO
 */
export type OperateLogItem = {
  logId: string;
  userId?: string;
  ip?: string;
  browser?: string;
  device?: string;
  opsModule?: string;
  opsName?: string;
  costTime?: number;
  createdTime?: string;
};

/**
 * 操作日志分页查询参数
 * 对应后端的 OperateLogPageQuery + PageQuery
 */
export type OperateLogPageParams = {
  pageNum?: number;
  pageSize?: number;
  opsModule?: string;
  opsName?: string;
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
 * 分页查询操作日志
 * GET /api/operate-log/page
 */
export async function pageOperateLogs(params: OperateLogPageParams) {
  return request<Result<PageInfo<OperateLogItem>>>('/api/operate-log/page', {
    method: 'GET',
    params,
  });
}

