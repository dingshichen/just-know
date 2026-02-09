// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export class AttachOption {
  attachId?: number;
  title?: string;
  attachUrl?: string;
}

/**
 * 附件列表项，对应后端 AttachItem
 */
export type AttachItem = {
  attachId: string;
  title: string;
  storageType?: string;
  attachType?: string;
  attachUrl?: string;
  attachSize?: number;
  createdTime?: string;
  updatedTime?: string;
};

/**
 * 附件分页查询参数
 */
export type AttachPageParams = {
  pageNum?: number;
  pageSize?: number;
  title?: string;
  storageType?: string;
  attachType?: string;
};

type Result<T> = {
  code: number;
  msg: string;
  data: T;
};

/**
 * 附件统计，对应后端 AttachStats
 */
export type AttachStats = {
  total: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  yearCount: number;
};

type PageInfo<T> = {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
};

/**
 * 查询附件统计
 * GET /api/attach/stats
 */
export async function getAttachStats() {
  return request<Result<AttachStats>>('/api/attach/stats', {
    method: 'GET',
  });
}

/**
 * 分页查询附件
 * GET /api/attach/page
 */
export async function pageAttaches(params: AttachPageParams) {
  return request<Result<PageInfo<AttachItem>>>('/api/attach/page', {
    method: 'GET',
    params,
  });
}

/**
 * 上传附件
 * POST /api/attach
 */
export async function uploadAttach(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request<Result<AttachItem>>('/api/attach', {
    method: 'POST',
    data: formData,
  });
}

/**
 * 下载附件（触发浏览器下载）
 * GET /api/attach/download/{attachId}
 */
export async function downloadAttachFile(attachId: number, filename: string) {
  const blob = await request<Blob>('/api/attach/download/' + attachId, {
    method: 'GET',
    responseType: 'blob',
  });
  const url = URL.createObjectURL(blob as unknown as Blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'download';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * 删除附件
 * DELETE /api/attach/{attachId}
 */
export async function deleteAttach(attachId: number) {
  return request<Result<void>>(`/api/attach/${attachId}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除附件
 * DELETE /api/attach/batch
 */
export async function batchDeleteAttaches(attachIds: number[]) {
  return request<Result<void>>('/api/attach/batch', {
    method: 'DELETE',
    data: attachIds,
  });
}
