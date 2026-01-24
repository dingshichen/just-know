import type { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

/**
 * 本地附件数据 mock，结构与后端 AttachItem 对齐
 */
let mockAttaches: any[] = [
  {
    attachId: 1,
    title: '示例文档.pdf',
    storageType: 'LOCAL',
    attachType: '.pdf',
    attachUrl: '/api/attach/download/1',
    attachSize: 128,
    createdTime: '2024-01-01 10:00:00',
    updatedTime: '2024-01-01 10:00:00',
  },
  {
    attachId: 2,
    title: '示例图片.png',
    storageType: 'LOCAL',
    attachType: '.png',
    attachUrl: '/api/attach/download/2',
    attachSize: 256,
    createdTime: '2024-01-02 11:00:00',
    updatedTime: '2024-01-02 11:00:00',
  },
];

let attachIdSeq = mockAttaches.length + 1;

function computeStats() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // 本周一
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();

  const toTime = (s: string) => new Date(s.replace(' ', 'T')).getTime();

  let todayCount = 0;
  let weekCount = 0;
  let monthCount = 0;
  let yearCount = 0;
  for (const a of mockAttaches) {
    const t = toTime(a.createdTime || '2000-01-01 00:00:00');
    if (t >= startOfToday) todayCount++;
    if (t >= startOfWeek.getTime()) weekCount++;
    if (t >= startOfMonth) monthCount++;
    if (t >= startOfYear) yearCount++;
  }
  return {
    total: mockAttaches.length,
    todayCount,
    weekCount,
    monthCount,
    yearCount,
  };
}

export default {
  /**
   * 附件统计
   * GET /api/attach/stats
   */
  'GET /api/attach/stats': async (req: Request, res: Response) => {
    await waitTime(100);
    res.send({
      code: 0,
      msg: '请求成功',
      data: computeStats(),
    });
  },

  /**
   * 附件分页查询
   * GET /api/attach/page
   */
  'GET /api/attach/page': async (req: Request, res: Response) => {
    await waitTime(300);
    const { pageNum = '1', pageSize = '10', title, storageType, attachType } =
      req.query as Record<string, string>;

    let data = [...mockAttaches];

    if (title) {
      data = data.filter((item) => item.title?.includes(title));
    }
    if (storageType) {
      data = data.filter((item) => item.storageType === storageType);
    }
    if (attachType) {
      data = data.filter((item) => item.attachType === attachType);
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

  /**
   * 上传附件
   * POST /api/attach
   * 注意：mock 下为模拟，不解析 multipart 文件
   */
  'POST /api/attach': async (req: Request, res: Response) => {
    await waitTime(300);
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newAttach = {
      attachId: attachIdSeq++,
      title: 'mock-upload-file',
      storageType: 'LOCAL',
      attachType: '.txt',
      attachUrl: '/api/attach/download/' + (attachIdSeq - 1),
      attachSize: 1,
      createdTime: now,
      updatedTime: now,
    };
    mockAttaches.push(newAttach);

    res.send({
      code: 0,
      msg: '请求成功',
      data: newAttach,
    });
  },

  /**
   * 下载附件
   * GET /api/attach/download/:attachId
   */
  'GET /api/attach/download/:attachId': (req: Request, res: Response) => {
    res.setHeader('Content-Disposition', 'attachment; filename="mock-download.txt"');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send('mock file content');
  },

  /**
   * 删除附件
   * DELETE /api/attach/:attachId
   */
  'DELETE /api/attach/:attachId': async (req: Request, res: Response) => {
    await waitTime(300);
    const { attachId } = req.params;
    const idNum = Number(attachId);
    mockAttaches = mockAttaches.filter((item) => item.attachId !== idNum);

    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },

  /**
   * 批量删除附件
   * DELETE /api/attach/batch
   * 请求体为 attachIds: number[]
   */
  'DELETE /api/attach/batch': async (req: Request, res: Response) => {
    await waitTime(300);
    const attachIds: number[] = Array.isArray(req.body) ? req.body : [];
    if (attachIds.length > 0) {
      mockAttaches = mockAttaches.filter((item) => !attachIds.includes(item.attachId));
    }

    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },
};
