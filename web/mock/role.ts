import type { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

/**
 * 本地角色数据 mock，结构与后端 RoleItem 对齐
 */
let mockRoles: any[] = [
  {
    roleId: 1,
    roleName: '系统管理员',
    roleCode: 'ADMIN',
    roleDesc: '拥有系统全部权限',
    createdTime: '2024-01-01 10:00:00',
    updatedTime: '2024-01-01 10:00:00',
  },
  {
    roleId: 2,
    roleName: '普通用户',
    roleCode: 'USER',
    roleDesc: '普通业务操作权限',
    createdTime: '2024-01-02 11:00:00',
    updatedTime: '2024-01-02 11:00:00',
  },
];

let roleIdSeq = mockRoles.length + 1;

export default {
  /**
   * 角色分页查询
   * GET /api/role/page
   */
  'GET /api/role/page': async (req: Request, res: Response) => {
    await waitTime(300);
    const { pageNum = '1', pageSize = '10', roleName, roleCode } = req.query as Record<
      string,
      string
    >;

    let data = [...mockRoles];

    if (roleName) {
      data = data.filter((item) => item.roleName?.includes(roleName));
    }
    if (roleCode) {
      data = data.filter((item) => item.roleCode?.includes(roleCode));
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
   * 新增角色
   * POST /api/role
   */
  'POST /api/role': async (req: Request, res: Response) => {
    await waitTime(300);
    const body = req.body || {};
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newRole = {
      roleId: roleIdSeq++,
      roleName: body.roleName,
      roleCode: body.roleCode,
      roleDesc: body.roleDesc,
      createdTime: now,
      updatedTime: now,
    };
    mockRoles.push(newRole);

    res.send({
      code: 0,
      msg: '请求成功',
      data: newRole.roleId,
    });
  },

  /**
   * 修改角色
   * PUT /api/role/:roleId
   */
  'PUT /api/role/:roleId': async (req: Request, res: Response) => {
    await waitTime(300);
    const { roleId } = req.params;
    const body = req.body || {};
    const idNum = Number(roleId);

    mockRoles = mockRoles.map((item) => {
      if (item.roleId === idNum) {
        return {
          ...item,
          roleName: body.roleName,
          roleCode: body.roleCode,
          roleDesc: body.roleDesc,
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
   * 删除角色
   * DELETE /api/role/:roleId
   */
  'DELETE /api/role/:roleId': async (req: Request, res: Response) => {
    await waitTime(300);
    const { roleId } = req.params;
    const idNum = Number(roleId);
    mockRoles = mockRoles.filter((item) => item.roleId !== idNum);

    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },

  /**
   * 批量删除角色
   * DELETE /api/role/batch?roleIds=1&roleIds=2
   */
  'DELETE /api/role/batch': async (req: Request, res: Response) => {
    await waitTime(300);
    const { roleIds } = req.query as any;
    let ids: number[] = [];

    if (Array.isArray(roleIds)) {
      ids = roleIds.map((id) => Number(id));
    } else if (roleIds) {
      ids = String(roleIds)
        .split(',')
        .map((id) => Number(id));
    }

    if (ids.length > 0) {
      mockRoles = mockRoles.filter((item) => !ids.includes(item.roleId));
    }

    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },

  /**
   * 获取角色详情
   * GET /api/role/:roleId
   */
  'GET /api/role/:roleId': async (req: Request, res: Response) => {
    await waitTime(200);
    const { roleId } = req.params;
    const idNum = Number(roleId);
    const role = mockRoles.find((item) => item.roleId === idNum);

    if (!role) {
      res.send({
        code: 1004,
        msg: '角色不存在',
        data: null,
      });
      return;
    }

    res.send({
      code: 0,
      msg: '请求成功',
      data: role,
    });
  },
};

