// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 机构列表项
 * 对应后端的 DeptItem DTO
 */
export type DeptItem = {
  deptId: string;
  deptName: string;
  deptCode?: string;
  deptDesc?: string;
  parentDeptId?: string;
  sortNo?: number;
  createdTime?: string;
  updatedTime?: string;
  children?: DeptItem[];
};

/**
 * 机构分页查询参数
 * 对应后端的 DeptPageQuery + PageQuery
 */
export type DeptPageParams = {
  pageNum?: number;
  pageSize?: number;
  deptName?: string;
  deptCode?: string;
  parentDeptId?: string;
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
 * 分页查询机构
 * GET /api/dept/page
 */
export async function pageDepts(params: DeptPageParams) {
  return request<Result<PageInfo<DeptItem>>>('/api/dept/page', {
    method: 'GET',
    params,
  });
}

/**
 * 查询所有机构树形列表
 * GET /api/dept/tree
 */
export async function listDeptTree() {
  return request<Result<DeptItem[]>>('/api/dept/tree', {
    method: 'GET',
  });
}

/**
 * 机构表单
 * 对应后端的 DeptCreate / DeptUpdate DTO
 */
export type DeptForm = {
  deptName: string;
  deptCode?: string;
  deptDesc?: string;
  parentDeptId?: string;
  sortNo: number;
};

/**
 * 新增机构
 * POST /api/dept
 */
export async function createDept(body: DeptForm) {
  return request<Result<string>>('/api/dept', {
    method: 'POST',
    data: body,
  });
}

/**
 * 修改机构
 * PUT /api/dept/{deptId}
 */
export async function updateDept(deptId: string, body: DeptForm) {
  return request<Result<void>>(`/api/dept/${deptId}`, {
    method: 'PUT',
    data: body,
  });
}

/**
 * 删除机构
 * DELETE /api/dept/{deptId}
 */
export async function deleteDept(deptId: string) {
  return request<Result<void>>(`/api/dept/${deptId}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除机构
 * DELETE /api/dept/batch?deptIds=1&deptIds=2
 */
export async function batchDeleteDepts(deptIds: string[]) {
  return request<Result<void>>('/api/dept/batch', {
    method: 'DELETE',
    params: {
      deptIds,
    },
  });
}
