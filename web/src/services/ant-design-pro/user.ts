// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import type { DeptOption } from './dept';
import type { RoleOption } from './role';
import type { AttachOption } from './attach';


/**
 * 用户选项
 */
export class UserOption {
  userId: string;
  userName: string;
  constructor(userId: string, userName: string) {
    this.userId = userId;
    this.userName = userName;
  }
}

/**
 * 用户列表项
 * 对应后端的 UserItem DTO
 */
export class UserItem extends UserOption {
  account?: string;
  gender?: string;
  phone?: string;
  email?: string;
  lockedFlag?: boolean;
  avatar?: AttachOption;
  roles?: RoleOption[];
  depts?: DeptOption[];
  createdTime?: string;
  updatedTime?: string;
}

/**
 * 登录会话信息
 */
export class LoginSessionInfo {
  device?: string;
  ip?: string;
  browser?: string;
  loginTime?: string;
  token?: string;
}

/**
 * 用户详情
 * 对应后端的 UserDetail DTO
 */
export class UserDetail extends UserItem {
  loginSessions?: LoginSessionInfo[];
  createdUser?: UserOption;
  updatedUser?: UserOption;
}

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
  /** 角色ID列表（多选） */
  roleIds?: string[];
  /** 部门ID列表（多选） */
  deptIds?: string[];
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
  /**
   * 用户头像对应的附件ID
   */
  avatarAttachId?: string;
  deptIds?: string[];
  /**
   * 角色ID列表（字符串类型，避免精度问题）
   */
  roleIds?: string[];
};

export async function createUser(body: UserForm) {
  return request<Result<string>>('/api/user', {
    method: 'POST',
    data: body,
  });
}

/**
 * 修改用户
 * PUT /api/user/{userId}
 */
export async function updateUser(userId: string, body: UserForm) {
  return request<Result<void>>(`/api/user/${userId}`, {
    method: 'PUT',
    data: body,
  });
}

/**
 * 给用户分配角色
 * PUT /api/user/{userId}/roles
 */
export async function assignUserRoles(userId: string, roleIds: string[]) {
  return request<Result<void>>(`/api/user/${userId}/roles`, {
    method: 'PUT',
    // 后端接收 List<Long>，这里直接传字符串数组，Spring 会自动转换
    data: roleIds || [],
  });
}

/**
 * 删除用户
 * DELETE /api/user/{userId}
 */
export async function deleteUser(userId: string) {
  return request<Result<void>>(`/api/user/${userId}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除用户
 * DELETE /api/user/batch?userIds=1&userIds=2
 */
export async function batchDeleteUsers(userIds: string[]) {
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
export async function lockUser(userId: string) {
  return request<Result<void>>(`/api/user/${userId}/lock`, {
    method: 'PUT',
  });
}

/**
 * 解锁用户
 * PUT /api/user/{userId}/unlock
 */
export async function unlockUser(userId: string) {
  return request<Result<void>>(`/api/user/${userId}/unlock`, {
    method: 'PUT',
  });
}

/**
 * 重置用户密码为默认密码 123456
 * PUT /api/user/{userId}/reset-password
 */
export async function resetUserPassword(userId: string) {
  return request<Result<void>>(`/api/user/${userId}/reset-password`, {
    method: 'PUT',
  });
}

/**
 * 获取用户详情
 * GET /api/user/{userId}
 */
export async function getUserDetail(userId: string) {
  return request<Result<UserDetail>>(`/api/user/${userId}`, {
    method: 'GET',
  });
}

/**
 * 获取用户部门ID列表
 * GET /api/user/{userId}/depts
 */
export async function getUserDeptIds(userId: string) {
  return request<Result<string[]>>(`/api/user/${userId}/depts`, {
    method: 'GET',
  });
}

