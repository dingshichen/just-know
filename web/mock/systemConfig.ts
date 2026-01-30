import type { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

/**
 * 本地系统配置数据 mock，与后端 SystemConfigKey 枚举对齐
 */
let mockSystemConfigs: any[] = [
  {
    configId: 1,
    configName: '用户初始密码',
    configKey: 'user.initial.password',
    configValue: '123456',
    configDesc: '新用户创建时的初始密码',
    createdTime: '2024-01-01 10:00:00',
    updatedTime: '2024-01-01 10:00:00',
  },
  {
    configId: 2,
    configName: '新用户首次登录是否强制修改密码',
    configKey: 'user.force_change_password_on_first_login',
    configValue: 'true',
    configDesc: 'true 表示强制修改，false 表示不强制',
    createdTime: '2024-01-01 10:00:00',
    updatedTime: '2024-01-01 10:00:00',
  },
  {
    configId: 3,
    configName: '密码器',
    configKey: 'security.password_encoder',
    configValue: 'bcrypt',
    configDesc: '可选：bcrypt、pbkdf2、scrypt、argon2、noop（与 Spring Security DelegatingPasswordEncoder 一致）',
    createdTime: '2024-01-01 10:00:00',
    updatedTime: '2024-01-01 10:00:00',
  },
  {
    configId: 4,
    configName: '用户登录过期时间',
    configKey: 'user.login.expire_hours',
    configValue: '2',
    configDesc: '单位：小时，JWT 或会话过期时间',
    createdTime: '2024-01-01 10:00:00',
    updatedTime: '2024-01-01 10:00:00',
  },
];

export default {
  /**
   * 查询所有系统配置
   * GET /api/system-config
   */
  'GET /api/system-config': async (req: Request, res: Response) => {
    await waitTime(300);
    res.send({
      code: 0,
      msg: '请求成功',
      data: [...mockSystemConfigs],
    });
  },

  /**
   * 根据 configKey 修改 configValue
   * PUT /api/system-config/value
   */
  'PUT /api/system-config/value': async (req: Request, res: Response) => {
    await waitTime(300);
    const body = req.body || {};
    const { configKey, configValue } = body;
    const idx = mockSystemConfigs.findIndex((item) => item.configKey === configKey);
    if (idx >= 0) {
      mockSystemConfigs[idx] = {
        ...mockSystemConfigs[idx],
        configValue: configValue ?? mockSystemConfigs[idx].configValue,
        updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
    } else {
      // 枚举内允许的 key 可新增一条（与后端“不存在则插入”一致）
      mockSystemConfigs.push({
        configId: mockSystemConfigs.length + 1,
        configName: configKey,
        configKey,
        configValue: configValue ?? '',
        configDesc: '',
        createdTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      });
    }
    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },
};
