// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 系统配置列表项
 * 对应后端的 SystemConfigItem DTO
 */
export type SystemConfigItem = {
  configId?: number;
  configName: string;
  configKey: string;
  configValue?: string;
  configDesc?: string;
  createdTime?: string;
  updatedTime?: string;
};

/**
 * 通用接口返回结构
 */
type Result<T> = {
  code: number;
  msg: string;
  data: T;
};

/**
 * 查询所有系统配置
 * GET /api/system-config
 */
export async function listSystemConfigs() {
  return request<Result<SystemConfigItem[]>>('/api/system-config', {
    method: 'GET',
  });
}

/**
 * 根据 configKey 修改 configValue
 * PUT /api/system-config/value
 */
export type SystemConfigValueUpdate = {
  configKey: string;
  configValue: string;
};

export async function updateSystemConfigValue(body: SystemConfigValueUpdate) {
  return request<Result<void>>('/api/system-config/value', {
    method: 'PUT',
    data: body,
  });
}
