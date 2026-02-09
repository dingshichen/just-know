// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 公告选项
 */
export class NoticeOption {
  noticeId: string;
  title: string;
  constructor(noticeId: string, title: string) {
    this.noticeId = noticeId;
    this.title = title;
  }
}

/**
 * 公告列表项
 * 对应后端的 NoticeItem DTO
 */
export class NoticeItem extends NoticeOption {
  content?: string;
  noticeStatus?: string;
  startDate?: string;
  endDate?: string;
  createdTime?: string;
  updatedTime?: string;
}

/**
 * 公告详情
 * 对应后端的 NoticeDetail DTO
 */
export class NoticeDetail extends NoticeItem {}

/**
 * 公告分页查询参数
 */
export type NoticePageParams = {
  pageNum?: number;
  pageSize?: number;
  title?: string;
  noticeStatus?: string;
};

/**
 * 公告表单（新建/编辑）
 */
export type NoticeForm = {
  title: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  noticeStatus?: string;
};

/**
 * 通用接口返回结构
 */
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
 * 分页查询公告
 * GET /api/notice/page
 */
export async function pageNotices(params: NoticePageParams) {
  return request<Result<PageInfo<NoticeItem>>>('/api/notice/page', {
    method: 'GET',
    params,
  });
}

/**
 * 根据 ID 查询公告详情
 * GET /api/notice/{noticeId}
 */
export async function getNoticeDetail(noticeId: string) {
  return request<Result<NoticeDetail>>(`/api/notice/${noticeId}`, {
    method: 'GET',
  });
}

/**
 * 新增公告
 * POST /api/notice
 */
export async function createNotice(body: NoticeForm) {
  return request<Result<number>>('/api/notice', {
    method: 'POST',
    data: body,
  });
}

/**
 * 修改公告
 * PUT /api/notice/{noticeId}
 */
export async function updateNotice(noticeId: string, body: NoticeForm) {
  return request<Result<void>>(`/api/notice/${noticeId}`, {
    method: 'PUT',
    data: body,
  });
}

/**
 * 发布公告
 * POST /api/notice/{noticeId}/publish
 */
export async function publishNotice(noticeId: string) {
  return request<Result<void>>(`/api/notice/${noticeId}/publish`, {
    method: 'POST',
  });
}

/**
 * 删除公告
 * DELETE /api/notice/{noticeId}
 */
export async function deleteNotice(noticeId: string) {
  return request<Result<void>>(`/api/notice/${noticeId}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除公告
 * DELETE /api/notice/batch?noticeIds=1&noticeIds=2
 */
export async function batchDeleteNotices(noticeIds: string[]) {
  return request<Result<void>>('/api/notice/batch', {
    method: 'DELETE',
    params: {
      noticeIds,
    },
  });
}

/**
 * 查询当前用户未读公告列表
 * GET /api/notice/unread
 */
export async function listUnreadNotices() {
  return request<Result<NoticeDetail[]>>('/api/notice/unread', {
    method: 'GET',
  });
}

/**
 * 记录当前用户已阅读指定公告
 * POST /api/notice/{noticeId}/read
 */
export async function readNotice(noticeId: string) {
  return request<Result<void>>(`/api/notice/${noticeId}/read`, {
    method: 'POST',
  });
}
