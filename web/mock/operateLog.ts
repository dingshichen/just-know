import type { Request, Response } from 'express';

const waitTime = (time: number = 100) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });

/**
 * 本地操作日志数据 mock，结构与后端 OperateLogItem 对齐
 */
let mockOperateLogs: any[] = [
  {
    logId: 1,
    userId: 1,
    ip: '127.0.0.1',
    browser: 'Chrome',
    device: 'Windows',
    opsModule: '系统管理-用户管理',
    opsName: '新增用户',
    costTime: 120,
    createdTime: '2024-01-01 11:00:00',
  },
  {
    logId: 2,
    userId: 1,
    ip: '127.0.0.1',
    browser: 'Chrome',
    device: 'Windows',
    opsModule: '系统管理-用户管理',
    opsName: '修改用户',
    costTime: 80,
    createdTime: '2024-01-02 09:30:00',
  },
];

export default {
  /**
   * 操作日志分页查询
   * GET /api/operate-log/page
   */
  'GET /api/operate-log/page': async (req: Request, res: Response) => {
    await waitTime(300);
    const {
      pageNum = '1',
      pageSize = '10',
      opsModule,
      opsName,
    } = req.query as Record<string, string>;

    let data = [...mockOperateLogs];

    if (opsModule) {
      data = data.filter((item) => item.opsModule?.includes(opsModule));
    }
    if (opsName) {
      data = data.filter((item) => item.opsName?.includes(opsName));
    }

    const pageNumNum = Number(pageNum) || 1;
    const pageSizeNum = Number(pageSize) || 10;
    const start = (pageNumNum - 1) * pageSizeNum;
    const end = start + pageSizeNum;

    const pageList = data.slice(start, end);

    res.send({
      code: 0,
      msg: '请求成功',
      data: {
        list: pageList,
        total: data.length,
        pageNum: pageNumNum,
        pageSize: pageSizeNum,
      },
    });
  },
};

