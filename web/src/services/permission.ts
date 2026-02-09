// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 权限列表项
 * 对应后端的 PermissionItem DTO
 */
export type PermissionItem = {
  permissionId: string;
  permissionName: string;
  permissionCode?: string;
  createdTime?: string;
  updatedTime?: string;
};

/**
 * 权限分页查询参数
 * 对应后端的 PermissionPageQuery + PageQuery
 */
export type PermissionPageParams = {
  pageNum?: number;
  pageSize?: number;
  permissionName?: string;
  permissionCode?: string;
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
 * 分页查询权限
 * GET /api/permission/page
 */
export async function pagePermissions(params: PermissionPageParams) {
  return request<Result<PageInfo<PermissionItem>>>('/api/permission/page', {
    method: 'GET',
    params,
  });
}

/**
 * 权限表单
 * 对应后端的 PermissionCreate / PermissionUpdate DTO
 */
export type PermissionForm = {
  permissionName: string;
  permissionCode: string;
};

/**
 * 新增权限
 * POST /api/permission
 */
export async function createPermission(body: PermissionForm) {
  return request<Result<number>>('/api/permission', {
    method: 'POST',
    data: body,
  });
}

/**
 * 修改权限
 * PUT /api/permission/{permissionId}
 */
export async function updatePermission(permissionId: string, body: PermissionForm) {
  return request<Result<void>>(`/api/permission/${permissionId}`, {
    method: 'PUT',
    data: body,
  });
}

/**
 * 删除权限
 * DELETE /api/permission/{permissionId}
 */
export async function deletePermission(permissionId: string) {
  return request<Result<void>>(`/api/permission/${permissionId}`, {
    method: 'DELETE',
  });
}

/**
 * 获取权限详情
 * GET /api/permission/{permissionId}
 */
export async function getPermissionDetail(permissionId: string) {
  return request<Result<PermissionItem>>(`/api/permission/${permissionId}`, {
    method: 'GET',
  });
}

/**
 * 批量删除权限
 * DELETE /api/permission/batch?permissionIds=1&permissionIds=2
 */
export async function batchDeletePermissions(permissionIds: string[]) {
  return request<Result<void>>('/api/permission/batch', {
    method: 'DELETE',
    params: {
      permissionIds,
    },
  });
}
