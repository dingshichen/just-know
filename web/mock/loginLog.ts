import type { Request, Response } from 'express';

const waitTime = (time: number = 100) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });

/**
 * 本地登录日志数据 mock，结构与后端 LoginLogItem 对齐
 */
let mockLoginLogs: any[] = [
  {
    logId: 1,
    loginUserId: 1,
    loginAccount: 'admin',
    ip: '127.0.0.1',
    browser: 'Chrome',
    device: 'Windows',
    loginActionType: 'LOGIN_SUCCESS',
    createdTime: '2024-01-01 10:00:00',
  },
  {
    logId: 2,
    loginUserId: 2,
    loginAccount: 'user',
    ip: '127.0.0.1',
    browser: 'Chrome',
    device: 'Windows',
    loginActionType: 'LOGIN_FAIL',
    createdTime: '2024-01-02 11:00:00',
  },
];

export default {
  /**
   * 登录日志分页查询
   * GET /api/login-log/page
   */
  'GET /api/login-log/page': async (req: Request, res: Response) => {
    await waitTime(300);
    const {
      pageNum = '1',
      pageSize = '10',
      loginAccount,
      loginActionType,
    } = req.query as Record<string, string>;

    let data = [...mockLoginLogs];

    if (loginAccount) {
      data = data.filter((item) => item.loginAccount?.includes(loginAccount));
    }
    if (loginActionType) {
      data = data.filter((item) => item.loginActionType === loginActionType);
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

