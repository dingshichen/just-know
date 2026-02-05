import type { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

/**
 * 本地权限数据 mock，结构与后端 PermissionItem 对齐
 */
let mockPermissions: any[] = [
  {
    permissionId: 1,
    permissionName: '用户管理',
    permissionCode: 'user:manage',
    createdTime: '2024-01-01 10:00:00',
    updatedTime: '2024-01-01 10:00:00',
  },
  {
    permissionId: 2,
    permissionName: '角色管理',
    permissionCode: 'role:manage',
    createdTime: '2024-01-02 11:00:00',
    updatedTime: '2024-01-02 11:00:00',
  },
];

let permissionIdSeq = mockPermissions.length + 1;

export default {
  /**
   * 权限分页查询
   * GET /api/permission/page
   */
  'GET /api/permission/page': async (req: Request, res: Response) => {
    await waitTime(300);
    const {
      pageNum = '1',
      pageSize = '10',
      permissionName,
      permissionCode,
    } = req.query as Record<string, string>;

    let data = [...mockPermissions];

    if (permissionName) {
      data = data.filter((item) => item.permissionName?.includes(permissionName));
    }
    if (permissionCode) {
      data = data.filter((item) => item.permissionCode?.includes(permissionCode));
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
   * 新增权限
   * POST /api/permission
   */
  'POST /api/permission': async (req: Request, res: Response) => {
    await waitTime(300);
    const body = req.body || {};
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newPermission = {
      permissionId: permissionIdSeq++,
      permissionName: body.permissionName,
      permissionCode: body.permissionCode,
      createdTime: now,
      updatedTime: now,
    };
    mockPermissions.push(newPermission);

    res.send({
      code: 0,
      msg: '请求成功',
      data: newPermission.permissionId,
    });
  },

  /**
   * 修改权限
   * PUT /api/permission/:permissionId
   */
  'PUT /api/permission/:permissionId': async (req: Request, res: Response) => {
    await waitTime(300);
    const { permissionId } = req.params;
    const body = req.body || {};
    const idNum = Number(permissionId);

    mockPermissions = mockPermissions.map((item) => {
      if (item.permissionId === idNum) {
        return {
          ...item,
          permissionName: body.permissionName,
          permissionCode: body.permissionCode,
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
   * 删除权限
   * DELETE /api/permission/:permissionId
   */
  'DELETE /api/permission/:permissionId': async (req: Request, res: Response) => {
    await waitTime(300);
    const { permissionId } = req.params;
    const idNum = Number(permissionId);
    mockPermissions = mockPermissions.filter((item) => item.permissionId !== idNum);

    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },

  /**
   * 批量删除权限
   * DELETE /api/permission/batch?permissionIds=1&permissionIds=2
   */
  'DELETE /api/permission/batch': async (req: Request, res: Response) => {
    await waitTime(300);
    const { permissionIds } = req.query as any;
    let ids: number[] = [];

    if (Array.isArray(permissionIds)) {
      ids = permissionIds.map((id) => Number(id));
    } else if (permissionIds) {
      ids = String(permissionIds)
        .split(',')
        .map((id) => Number(id));
    }

    if (ids.length > 0) {
      mockPermissions = mockPermissions.filter((item) => !ids.includes(item.permissionId));
    }

    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },

  /**
   * 获取权限详情
   * GET /api/permission/:permissionId
   */
  'GET /api/permission/:permissionId': async (req: Request, res: Response) => {
    await waitTime(200);
    const { permissionId } = req.params;
    const idNum = Number(permissionId);
    const permission = mockPermissions.find((item) => item.permissionId === idNum);

    if (!permission) {
      res.send({
        code: 1004,
        msg: '权限不存在',
        data: null,
      });
      return;
    }

    res.send({
      code: 0,
      msg: '请求成功',
      data: permission,
    });
  },
};
