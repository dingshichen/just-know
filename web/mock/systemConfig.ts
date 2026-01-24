import type { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

/**
 * 本地系统配置数据 mock，结构与后端 SystemConfigItem 对齐
 */
let mockSystemConfigs: any[] = [
  {
    configId: 1,
    configName: '站点名称',
    configKey: 'site.name',
    configValue: 'Just Know',
    configDesc: '网站显示名称',
    createdTime: '2024-01-01 10:00:00',
    updatedTime: '2024-01-01 10:00:00',
  },
  {
    configId: 2,
    configName: '每页条数',
    configKey: 'page.size',
    configValue: '20',
    configDesc: '默认分页每页数量',
    createdTime: '2024-01-02 11:00:00',
    updatedTime: '2024-01-02 11:00:00',
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
    if (idx === -1) {
      res.send({
        code: 1,
        msg: '配置不存在: ' + configKey,
        data: null,
      });
      return;
    }
    mockSystemConfigs[idx] = {
      ...mockSystemConfigs[idx],
      configValue: configValue ?? mockSystemConfigs[idx].configValue,
      updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };
    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },
};
