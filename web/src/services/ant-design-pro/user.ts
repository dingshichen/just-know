// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 用户列表项
 * 对应后端的 UserItem DTO
 */
export type UserItem = {
  userId: number;
  userName: string;
  account?: string;
  gender?: string;
  phone?: string;
  email?: string;
  lockedFlag?: boolean;
  deptNames?: string[];
  createdTime?: string;
  updatedTime?: string;
};

/**
 * 用户分页查询参数
 * 对应后端的 UserPageQuery + PageQuery
 */
export type UserPageParams = {
  pageNum?: number;
  pageSize?: number;
  userName?: string;
  account?: string;
  phone?: string;
  email?: string;
  lockedFlag?: boolean;
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
 * 分页查询用户
 * GET /api/user/page
 */
export async function pageUsers(params: UserPageParams) {
  return request<Result<PageInfo<UserItem>>>('/api/user/page', {
    method: 'GET',
    params,
  });
}

/**
 * 新增用户
 * POST /api/user
 */
export type UserForm = {
  userName: string;
  account: string;
  gender?: string;
  phone?: string;
  email?: string;
  avatarAttachId?: number;
  deptIds?: number[];
};

export async function createUser(body: UserForm) {
  return request<Result<number>>('/api/user', {
    method: 'POST',
    data: body,
  });
}

/**
 * 修改用户
 * PUT /api/user/{userId}
 */
export async function updateUser(userId: number, body: UserForm) {
  return request<Result<void>>(`/api/user/${userId}`, {
    method: 'PUT',
    data: body,
  });
}

/**
 * 删除用户
 * DELETE /api/user/{userId}
 */
export async function deleteUser(userId: number) {
  return request<Result<void>>(`/api/user/${userId}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除用户
 * DELETE /api/user/batch?userIds=1&userIds=2
 */
export async function batchDeleteUsers(userIds: number[]) {
  return request<Result<void>>('/api/user/batch', {
    method: 'DELETE',
    params: {
      userIds,
    },
  });
}

/**
 * 锁定用户
 * PUT /api/user/{userId}/lock
 */
export async function lockUser(userId: number) {
  return request<Result<void>>(`/api/user/${userId}/lock`, {
    method: 'PUT',
  });
}

/**
 * 解锁用户
 * PUT /api/user/{userId}/unlock
 */
export async function unlockUser(userId: number) {
  return request<Result<void>>(`/api/user/${userId}/unlock`, {
    method: 'PUT',
  });
}

/**
 * 获取用户详情
 * GET /api/user/{userId}
 */
export async function getUserDetail(userId: number) {
  return request<Result<{
    userId: number;
    userName: string;
    account?: string;
    gender?: string;
    phone?: string;
    email?: string;
    deptIds?: number[];
    deptNames?: string[];
  }>>(`/api/user/${userId}`, {
    method: 'GET',
  });
}

/**
 * 获取用户部门ID列表
 * GET /api/user/{userId}/depts
 */
export async function getUserDeptIds(userId: number) {
  return request<Result<number[]>>(`/api/user/${userId}/depts`, {
    method: 'GET',
  });
}

