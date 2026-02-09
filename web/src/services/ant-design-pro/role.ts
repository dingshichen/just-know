// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 角色选项
 */
export class RoleOption {
  roleId: string;
  roleName: string;
  constructor(roleId: string, roleName: string) {
    this.roleId = roleId;
    this.roleName = roleName;
  }
}

/**
 * 角色列表项
 * 对应后端的 RoleItem DTO
 */
export class RoleItem extends RoleOption {
  roleCode?: string;
  roleDesc?: string;
  createdTime?: string;
  updatedTime?: string;
}

/**
 * 角色分页查询参数
 * 对应后端的 RolePageQuery + PageQuery
 */
export type RolePageParams = {
  pageNum?: number;
  pageSize?: number;
  roleName?: string;
  roleCode?: string;
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
 * 分页查询角色
 * GET /api/role/page
 */
export async function pageRoles(params: RolePageParams) {
  return request<Result<PageInfo<RoleItem>>>('/api/role/page', {
    method: 'GET',
    params,
  });
}

/**
 * 查询所有角色
 * GET /api/role/list
 */
export async function listAllRoles() {
  return request<Result<RoleItem[]>>('/api/role/list', {
    method: 'GET',
  });
}

/**
 * 角色表单
 * 对应后端的 RoleCreate / RoleUpdate DTO
 */
export type RoleForm = {
  roleName: string;
  roleCode: string;
  roleDesc?: string;
};

/**
 * 新增角色
 * POST /api/role
 */
export async function createRole(body: RoleForm) {
  return request<Result<number>>('/api/role', {
    method: 'POST',
    data: body,
  });
}

/**
 * 修改角色
 * PUT /api/role/{roleId}
 */
export async function updateRole(roleId: number, body: RoleForm) {
  return request<Result<void>>(`/api/role/${roleId}`, {
    method: 'PUT',
    data: body,
  });
}

/**
 * 删除角色
 * DELETE /api/role/{roleId}
 */
export async function deleteRole(roleId: number) {
  return request<Result<void>>(`/api/role/${roleId}`, {
    method: 'DELETE',
  });
}

/**
 * 获取角色详情
 * GET /api/role/{roleId}
 */
export async function getRoleDetail(roleId: number) {
  return request<Result<RoleItem>>(`/api/role/${roleId}`, {
    method: 'GET',
  });
}

/**
 * 批量删除角色
 * DELETE /api/role/batch?roleIds=1&roleIds=2
 */
export async function batchDeleteRoles(roleIds: number[]) {
  return request<Result<void>>('/api/role/batch', {
    method: 'DELETE',
    params: {
      roleIds,
    },
  });
}

