import type { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

/**
 * 本地机构数据 mock，结构与后端 DeptItem 对齐
 */
let mockDepts: any[] = [
  {
    deptId: '1',
    deptName: '总公司',
    deptCode: 'HQ',
    deptDesc: '集团总部',
    parentDeptId: null,
    sortNo: 1,
    createdTime: '2024-01-01 10:00:00',
    updatedTime: '2024-01-01 10:00:00',
  },
  {
    deptId: '2',
    deptName: '信息技术部',
    deptCode: 'IT',
    deptDesc: '负责公司信息化建设',
    parentDeptId: '1',
    sortNo: 1,
    createdTime: '2024-01-02 10:00:00',
    updatedTime: '2024-01-02 10:00:00',
  },
  {
    deptId: '3',
    deptName: '市场部',
    deptCode: 'MKT',
    deptDesc: '负责市场营销',
    parentDeptId: '1',
    sortNo: 2,
    createdTime: '2024-01-03 10:00:00',
    updatedTime: '2024-01-03 10:00:00',
  },
  {
    deptId: '4',
    deptName: '研发中心',
    deptCode: 'RD',
    deptDesc: '产品研发部门',
    parentDeptId: '2',
    sortNo: 1,
    createdTime: '2024-01-04 10:00:00',
    updatedTime: '2024-01-04 10:00:00',
  },
  {
    deptId: '5',
    deptName: '运维中心',
    deptCode: 'OPS',
    deptDesc: '系统运维部门',
    parentDeptId: '2',
    sortNo: 2,
    createdTime: '2024-01-05 10:00:00',
    updatedTime: '2024-01-05 10:00:00',
  },
  {
    deptId: '6',
    deptName: '品牌推广部',
    deptCode: 'BRAND',
    deptDesc: '品牌建设与推广',
    parentDeptId: '3',
    sortNo: 1,
    createdTime: '2024-01-06 10:00:00',
    updatedTime: '2024-01-06 10:00:00',
  },
  {
    deptId: '7',
    deptName: '销售部',
    deptCode: 'SALES',
    deptDesc: '产品销售',
    parentDeptId: '3',
    sortNo: 2,
    createdTime: '2024-01-07 10:00:00',
    updatedTime: '2024-01-07 10:00:00',
  },
];

let deptIdSeq = mockDepts.length + 1;

/**
 * 构建树形结构
 */
function buildTree(depts: any[], parentId: string | null = null): any[] {
  const result: any[] = [];
  for (const dept of depts) {
    if (dept.parentDeptId === parentId) {
      const children = buildTree(depts, dept.deptId);
      const node = { ...dept };
      if (children.length > 0) {
        node.children = children;
      }
      result.push(node);
    }
  }
  return result.sort((a, b) => (a.sortNo || 0) - (b.sortNo || 0));
}

export default {
  /**
   * 机构分页查询
   * GET /api/dept/page
   */
  'GET /api/dept/page': async (req: Request, res: Response) => {
    await waitTime(300);
    const { pageNum = '1', pageSize = '10', deptName, deptCode, parentDeptId } = req.query as Record<
      string,
      string
    >;

    let data = [...mockDepts];

    if (deptName) {
      data = data.filter((item) => item.deptName?.includes(deptName));
    }
    if (deptCode) {
      data = data.filter((item) => item.deptCode?.includes(deptCode));
    }
    if (parentDeptId !== undefined && parentDeptId !== '') {
      data = data.filter((item) => item.parentDeptId === parentDeptId);
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
   * 查询所有机构树形列表
   * GET /api/dept/tree
   */
  'GET /api/dept/tree': async (_req: Request, res: Response) => {
    await waitTime(300);
    const tree = buildTree(mockDepts);

    res.send({
      code: 0,
      msg: '请求成功',
      data: tree,
    });
  },

  /**
   * 新增机构
   * POST /api/dept
   */
  'POST /api/dept': async (req: Request, res: Response) => {
    await waitTime(300);
    const body = req.body || {};
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newDept = {
      deptId: String(deptIdSeq++),
      deptName: body.deptName,
      deptCode: body.deptCode,
      deptDesc: body.deptDesc,
      parentDeptId: body.parentDeptId || null,
      sortNo: body.sortNo || 0,
      createdTime: now,
      updatedTime: now,
    };
    mockDepts.push(newDept);

    res.send({
      code: 0,
      msg: '请求成功',
      data: newDept.deptId,
    });
  },

  /**
   * 修改机构
   * PUT /api/dept/:deptId
   */
  'PUT /api/dept/:deptId': async (req: Request, res: Response) => {
    await waitTime(300);
    const { deptId } = req.params;
    const body = req.body || {};

    mockDepts = mockDepts.map((item) => {
      if (item.deptId === deptId) {
        return {
          ...item,
          deptName: body.deptName,
          deptCode: body.deptCode,
          deptDesc: body.deptDesc,
          parentDeptId: body.parentDeptId || null,
          sortNo: body.sortNo || 0,
          updatedTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };
      }
      return item;
    });

    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },

  /**
   * 删除机构
   * DELETE /api/dept/:deptId
   */
  'DELETE /api/dept/:deptId': async (req: Request, res: Response) => {
    await waitTime(300);
    const { deptId } = req.params;
    mockDepts = mockDepts.filter((item) => item.deptId !== deptId);

    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },

  /**
   * 批量删除机构
   * DELETE /api/dept/batch?deptIds=1&deptIds=2
   */
  'DELETE /api/dept/batch': async (req: Request, res: Response) => {
    await waitTime(300);
    const { deptIds } = req.query as any;
    let ids: string[] = [];

    if (Array.isArray(deptIds)) {
      ids = deptIds.map((id) => String(id));
    } else if (deptIds) {
      ids = String(deptIds).split(',');
    }

    if (ids.length > 0) {
      mockDepts = mockDepts.filter((item) => !ids.includes(item.deptId));
    }

    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },

  /**
   * 获取机构详情
   * GET /api/dept/:deptId
   */
  'GET /api/dept/:deptId': async (req: Request, res: Response) => {
    await waitTime(200);
    const { deptId } = req.params;
    const dept = mockDepts.find((item) => item.deptId === deptId);

    if (!dept) {
      res.send({
        code: 1004,
        msg: '机构不存在',
        data: null,
      });
      return;
    }

    res.send({
      code: 0,
      msg: '请求成功',
      data: dept,
    });
  },
};
