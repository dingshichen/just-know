import type { Request, Response } from 'express';

const waitTime = (time: number = 100) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });

type MockNotice = {
  noticeId: number;
  title: string;
  content?: string;
  noticeStatus?: 'DRAFT' | 'PUBLISHED';
  startDate?: string;
  endDate?: string;
  createdTime?: string;
  updatedTime?: string;
};

/**
 * 本地系统公告数据 mock，结构与后端 NoticeItem 对齐
 * ID 使用 number，返回时统一转为 string，避免前端精度问题
 */
let mockNotices: MockNotice[] = [
  {
    noticeId: 1,
    title: '系统维护公告',
    content: '本周日 00:00-02:00 将进行系统维护，请提前保存数据。',
    noticeStatus: 'PUBLISHED',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    createdTime: '2024-01-01 10:00:00',
    updatedTime: '2024-01-01 10:30:00',
  },
  {
    noticeId: 2,
    title: '功能上线公告',
    content: '用户中心新增登录日志、操作日志等功能，欢迎体验。',
    noticeStatus: 'DRAFT',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    createdTime: '2024-02-01 09:00:00',
    updatedTime: '2024-02-01 09:30:00',
  },
];

let readNoticeIds: number[] = [];

function toItem(item: MockNotice) {
  return {
    ...item,
    noticeId: String(item.noticeId),
  };
}

export default {
  /**
   * 分页查询公告列表
   * GET /api/notice/page
   * 注意：需在 /api/notice/:noticeId 之前定义，否则 page 会被当作 noticeId
   */
  'GET /api/notice/page': async (req: Request, res: Response) => {
    await waitTime(200);
    const {
      pageNum = 1,
      pageSize = 10,
      title,
      noticeStatus,
    } = (req.query || {}) as {
      pageNum?: string;
      pageSize?: string;
      title?: string;
      noticeStatus?: string;
    };
    let list = [...mockNotices];
    if (title) {
      list = list.filter((n) => n.title?.includes(title));
    }
    if (noticeStatus) {
      list = list.filter((n) => n.noticeStatus === noticeStatus);
    }
    const total = list.length;
    const page = Number(pageNum) || 1;
    const size = Number(pageSize) || 10;
    const start = (page - 1) * size;
    const pageList = list.slice(start, start + size);
    res.send({
      code: 0,
      msg: '请求成功',
      data: {
        list: pageList.map(toItem),
        total,
        pageNum: page,
        pageSize: size,
      },
    });
  },

  /**
   * 查询当前用户未读公告列表
   * GET /api/notice/unread
   */
  'GET /api/notice/unread': async (req: Request, res: Response) => {
    await waitTime(200);
    // 只返回已发布且未读的公告
    const list = mockNotices.filter(
      (n) => n.noticeStatus === 'PUBLISHED' && !readNoticeIds.includes(n.noticeId),
    );
    res.send({
      code: 0,
      msg: '请求成功',
      data: list.map(toItem),
    });
  },

  /**
   * 根据 ID 查询公告详情
   * GET /api/notice/:noticeId
   */
  'GET /api/notice/:noticeId': async (req: Request, res: Response) => {
    await waitTime(200);
    const { noticeId } = req.params as { noticeId: string };
    const idNum = Number(noticeId);
    const item = mockNotices.find((n) => n.noticeId === idNum);
    if (!item) {
      res.send({
        code: 1,
        msg: '公告不存在',
        data: null,
      });
      return;
    }
    res.send({
      code: 0,
      msg: '请求成功',
      data: toItem(item),
    });
  },

  /**
   * 新增公告
   * POST /api/notice
   */
  'POST /api/notice': async (req: Request, res: Response) => {
    await waitTime(200);
    const body = req.body || {};
    const maxId = mockNotices.length > 0 ? Math.max(...mockNotices.map((n) => n.noticeId)) : 0;
    const newNotice: MockNotice = {
      noticeId: maxId + 1,
      title: body.title || '未命名公告',
      content: body.content,
      noticeStatus: body.noticeStatus || 'DRAFT',
      startDate: body.startDate,
      endDate: body.endDate,
      createdTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };
    mockNotices.push(newNotice);
    res.send({
      code: 0,
      msg: '新增成功',
      data: newNotice.noticeId,
    });
  },

  /**
   * 修改公告
   * PUT /api/notice/:noticeId
   */
  'PUT /api/notice/:noticeId': async (req: Request, res: Response) => {
    await waitTime(200);
    const { noticeId } = req.params as { noticeId: string };
    const body = req.body || {};
    const idNum = Number(noticeId);
    const idx = mockNotices.findIndex((n) => n.noticeId === idNum);
    if (idx < 0) {
      res.send({
        code: 1,
        msg: '公告不存在',
        data: null,
      });
      return;
    }
    const item = mockNotices[idx];
    if (body.title != null) item.title = body.title;
    if (body.content != null) item.content = body.content;
    if (body.noticeStatus != null) item.noticeStatus = body.noticeStatus;
    if (body.startDate != null) item.startDate = body.startDate;
    if (body.endDate != null) item.endDate = body.endDate;
    item.updatedTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    res.send({
      code: 0,
      msg: '修改成功',
      data: null,
    });
  },

  /**
   * 发布公告
   * POST /api/notice/:noticeId/publish
   */
  'POST /api/notice/:noticeId/publish': async (req: Request, res: Response) => {
    await waitTime(200);
    const { noticeId } = req.params as { noticeId: string };
    const idNum = Number(noticeId);
    const item = mockNotices.find((n) => n.noticeId === idNum);
    if (!item) {
      res.send({
        code: 1,
        msg: '公告不存在',
        data: null,
      });
      return;
    }
    item.noticeStatus = 'PUBLISHED';
    item.updatedTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    res.send({
      code: 0,
      msg: '发布成功',
      data: null,
    });
  },

  /**
   * 记录当前用户已阅读指定公告
   * POST /api/notice/:noticeId/read
   */
  'POST /api/notice/:noticeId/read': async (req: Request, res: Response) => {
    await waitTime(200);
    const { noticeId } = req.params as { noticeId: string };
    const idNum = Number(noticeId);
    if (!Number.isNaN(idNum) && !readNoticeIds.includes(idNum)) {
      readNoticeIds.push(idNum);
    }
    res.send({
      code: 0,
      msg: '阅读记录成功',
      data: null,
    });
  },

  /**
   * 删除公告
   * DELETE /api/notice/:noticeId
   */
  'DELETE /api/notice/:noticeId': async (req: Request, res: Response) => {
    await waitTime(200);
    const { noticeId } = req.params as { noticeId: string };
    const idNum = Number(noticeId);
    mockNotices = mockNotices.filter((n) => n.noticeId !== idNum);
    res.send({
      code: 0,
      msg: '删除成功',
      data: null,
    });
  },

  /**
   * 批量删除公告
   * DELETE /api/notice/batch?noticeIds=1&noticeIds=2
   */
  'DELETE /api/notice/batch': async (req: Request, res: Response) => {
    await waitTime(200);
    const { noticeIds } = req.query as { noticeIds?: string | string[] };
    const ids: number[] = Array.isArray(noticeIds)
      ? noticeIds.map((id) => Number(id))
      : noticeIds
        ? [Number(noticeIds)]
        : [];
    if (!ids.length) {
      res.send({
        code: 1,
        msg: '缺少要删除的公告 ID',
        data: null,
      });
      return;
    }
    mockNotices = mockNotices.filter((n) => !ids.includes(n.noticeId));
    res.send({
      code: 0,
      msg: '批量删除成功',
      data: null,
    });
  },
};
