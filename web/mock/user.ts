import type { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(_req: Request, res: Response) {
  await waitTime(500);
  return res.json({
    code: 0,
    msg: '请求成功',
    data: {
      captchaId: 'mock-captcha-id',
      // 这里为了简化不返回真实图片，只返回空字符串；前端仍然可以正常拿到 captchaId
      captchaImage: '',
    },
  });
}

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */
let access =
  ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

const getAccess = () => {
  return access;
};

/**
 * 本地用户数据 mock，结构与后端 UserItem 对齐
 */
let mockUsers: any[] = [
  {
    userId: 1,
    userName: '系统管理员',
    account: 'admin',
    gender: '男',
    phone: '13800000000',
    email: 'admin@example.com',
    // 模拟该用户有头像
    avatarUrl:
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    lockedFlag: 0,
    roles: [
      {
        roleId: 1,
        roleName: '系统管理员',
      },
    ],
    depts: [
      {
        deptId: 1,
        deptName: '信息技术部',
      },
    ],
    createdTime: '2024-01-01 10:00:00',
    updatedTime: '2024-01-01 10:00:00',
  },
  {
    userId: 2,
    userName: '普通用户',
    account: 'user',
    gender: '女',
    phone: '13900000000',
    email: 'user@example.com',
    // 不设置 avatarUrl，前端会展示默认头像图标
    lockedFlag: 0,
    roles: [
      {
        roleId: 2,
        roleName: '普通用户',
      },
    ],
    depts: [
      {
        deptId: 2,
        deptName: '市场部',
      },
    ],
    createdTime: '2024-01-02 11:00:00',
    updatedTime: '2024-01-02 11:00:00',
  },
];

let userIdSeq = mockUsers.length + 1;

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  /** 获取当前登录用户，与后端 /api/user/current、UserSimpleDetail 对齐 */
  'GET /api/user/current': (_req: Request, res: Response) => {
    if (!getAccess()) {
      res.status(401).send({
        code: 1002,
        msg: '请先登录',
        data: null,
      });
      return;
    }
    res.send({
      code: 0,
      msg: '请求成功',
      data: {
        userName: 'Serati Ma',
        avatar:
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userId: 1,
        account: 'admin',
        isLockFlag: false,
        authorities: [{ permissionCode: getAccess() || 'user' }],
        access: getAccess() || undefined,
      },
    });
  },

  // 支持值为 Object 和 Array（保留旧 mock，供未迁移的请求使用）
  'GET /api/currentUser': (_req: Request, res: Response) => {
    if (!getAccess()) {
      res.status(401).send({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '请先登录！',
        success: true,
      });
      return;
    }
    res.send({
      success: true,
      data: {
        name: 'Serati Ma',
        avatar:
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userid: '00000001',
        email: 'antdesign@alipay.com',
        signature: '海纳百川，有容乃大',
        title: '交互专家',
        group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
        tags: [
          {
            key: '0',
            label: '很有想法的',
          },
          {
            key: '1',
            label: '专注设计',
          },
          {
            key: '2',
            label: '辣~',
          },
          {
            key: '3',
            label: '大长腿',
          },
          {
            key: '4',
            label: '川妹子',
          },
          {
            key: '5',
            label: '海纳百川',
          },
        ],
        notifyCount: 12,
        unreadCount: 11,
        country: 'China',
        access: getAccess(),
        geographic: {
          province: {
            label: '浙江省',
            key: '330000',
          },
          city: {
            label: '杭州市',
            key: '330100',
          },
        },
        address: '西湖区工专路 77 号',
        phone: '0752-268888888',
      },
    });
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  // 账号+密码+验证码登录，模拟后端 /login/password 接口
  'POST /api/login/password': async (req: Request, res: Response) => {
    const { password, username } = req.body;
    await waitTime(2000);
    if (password === 'ant.design' && username === 'admin') {
      access = 'admin';
      res.send({
        code: 0,
        msg: '请求成功',
        data: {
          token: 'mock-jwt-token',
          permissions: [],
        },
      });
      return;
    }
    if (password === 'ant.design' && username === 'user') {
      access = 'user';
      res.send({
        code: 0,
        msg: '请求成功',
        data: {
          token: 'mock-jwt-token',
          permissions: [],
        },
      });
      return;
    }

    access = 'guest';
    res.send({
      code: 1001,
      msg: '登录失败，账号或密码错误',
      data: null,
    });
  },
  'POST /api/logout': (_req: Request, res: Response) => {
    access = '';
    res.send({ data: {}, success: true });
  },
  'POST /api/register': (_req: Request, res: Response) => {
    res.send({ status: 'ok', currentAuthority: 'user', success: true });
  },
  'GET /api/500': (_req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (_req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (_req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Forbidden',
      message: 'Forbidden',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (_req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },

  // 图形验证码
  'GET /api/captcha': getFakeCaptcha,

  /**
   * 用户分页查询
   * GET /api/user/page
   */
  'GET /api/user/page': (req: Request, res: Response) => {
    const {
      pageNum = '1',
      pageSize = '10',
      userName,
      account,
      phone,
      email,
      lockedFlag,
      roleIds,
      deptIds,
    } = req.query as Record<string, string | string[]>;

    let data = [...mockUsers];

    if (userName) {
      data = data.filter((item) => item.userName?.includes(String(userName)));
    }
    if (account) {
      data = data.filter((item) => item.account?.includes(String(account)));
    }
    if (phone) {
      data = data.filter((item) => item.phone?.includes(String(phone)));
    }
    if (email) {
      data = data.filter((item) => item.email?.includes(String(email)));
    }
    if (lockedFlag !== undefined && lockedFlag !== '') {
      const flag = Number(lockedFlag);
      data = data.filter((item) => item.lockedFlag === flag);
    }
    if (roleIds && (Array.isArray(roleIds) ? roleIds.length > 0 : roleIds)) {
      const ids = Array.isArray(roleIds) ? roleIds.map(Number) : String(roleIds).split(',').map(Number);
      data = data.filter((item) =>
        (item.roles || []).some((r: any) => ids.includes(Number(r.roleId))),
      );
    }
    if (deptIds && (Array.isArray(deptIds) ? deptIds.length > 0 : deptIds)) {
      const ids = Array.isArray(deptIds) ? deptIds.map(Number) : String(deptIds).split(',').map(Number);
      data = data.filter((item) =>
        (item.depts || []).some((d: any) => ids.includes(Number(d.deptId))),
      );
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
   * 新增用户
   * POST /api/user
   */
  'POST /api/user': (req: Request, res: Response) => {
    const body: any = req.body || {};
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newUser = {
      userId: userIdSeq++,
      userName: body.userName,
      account: body.account,
      gender: body.gender,
      phone: body.phone,
      email: body.email,
      lockedFlag: 0,
      // 模拟头像与部门、角色
      avatarUrl: body.avatarAttachId
        ? `/api/attach/download/${body.avatarAttachId}`
        : undefined,
      depts:
        Array.isArray(body.deptIds) && body.deptIds.length > 0
          ? body.deptIds.map((id: any) => ({
              deptId: Number(id),
              deptName: `部门${id}`,
            }))
          : [],
      roles:
        Array.isArray(body.roleIds) && body.roleIds.length > 0
          ? body.roleIds.map((id: any) => ({
              roleId: Number(id),
              roleName: `角色${id}`,
            }))
          : [],
      createdTime: now,
      updatedTime: now,
    };
    mockUsers.push(newUser);

    res.send({
      code: 0,
      msg: '请求成功',
      data: newUser.userId,
    });
  },

  /**
   * 修改用户
   * PUT /api/user/:userId
   */
  'PUT /api/user/:userId': (req: Request, res: Response) => {
    const { userId } = req.params;
    const body: any = req.body || {};
    const idNum = Number(userId);

    mockUsers = mockUsers.map((item) => {
      if (item.userId === idNum) {
        return {
          ...item,
          userName: body.userName,
          account: body.account,
          gender: body.gender,
          phone: body.phone,
          email: body.email,
          avatarUrl: body.avatarAttachId
            ? `/api/attach/download/${body.avatarAttachId}`
            : item.avatarUrl,
          depts:
            Array.isArray(body.deptIds) && body.deptIds.length > 0
              ? body.deptIds.map((id: any) => ({
                  deptId: Number(id),
                  deptName: `部门${id}`,
                }))
              : [],
          roles:
            Array.isArray(body.roleIds) && body.roleIds.length > 0
              ? body.roleIds.map((id: any) => ({
                  roleId: Number(id),
                  roleName: `角色${id}`,
                }))
              : [],
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
   * 删除用户
   * DELETE /api/user/:userId
   */
  'DELETE /api/user/:userId': (req: Request, res: Response) => {
    const { userId } = req.params;
    const idNum = Number(userId);
    const user = mockUsers.find((item) => item.userId === idNum);
    if (user?.account === 'admin') {
      res.send({
        code: -1,
        msg: '不能对系统管理员进行删除操作',
        data: null,
      });
      return;
    }
    mockUsers = mockUsers.filter((item) => item.userId !== idNum);

    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },

  /**
   * 获取用户详情
   * GET /api/user/:userId
   */
  'GET /api/user/:userId': (req: Request, res: Response) => {
    const { userId } = req.params;
    const idNum = Number(userId);
    const user = mockUsers.find((item) => item.userId === idNum);

    if (!user) {
      res.send({
        code: 1004,
        msg: '用户不存在',
        data: null,
      });
      return;
    }

    res.send({
      code: 0,
      msg: '请求成功',
      data: {
        userId: String(user.userId),
        userName: user.userName,
        account: user.account,
        gender: user.gender,
        phone: user.phone,
        email: user.email,
        avatarUrl: user.avatarUrl,
        deptIds: (user.depts || []).map((d: any) => String(d.deptId)),
        deptNames: (user.depts || []).map((d: any) => d.deptName),
        roles: user.roles || [],
      },
    });
  },

  /**
   * 批量删除用户
   * DELETE /api/user/batch?userIds=1&userIds=2
   */
  'DELETE /api/user/batch': (req: Request, res: Response) => {
    const { userIds } = req.query as any;
    let ids: number[] = [];

    if (Array.isArray(userIds)) {
      ids = userIds.map((id) => Number(id));
    } else if (userIds) {
      ids = String(userIds)
        .split(',')
        .map((id) => Number(id));
    }

    const adminUser = mockUsers.find((u) => u.account === 'admin');
    if (adminUser && ids.includes(adminUser.userId)) {
      res.send({
        code: -1,
        msg: '不能对系统管理员进行删除操作',
        data: null,
      });
      return;
    }

    if (ids.length > 0) {
      mockUsers = mockUsers.filter((item) => !ids.includes(item.userId));
    }

    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },

  /**
   * 锁定用户
   * PUT /api/user/:userId/lock
   */
  'PUT /api/user/:userId/lock': (req: Request, res: Response) => {
    const { userId } = req.params;
    const idNum = Number(userId);
    const user = mockUsers.find((item) => item.userId === idNum);
    if (user?.account === 'admin') {
      res.send({
        code: -1,
        msg: '不能对系统管理员进行锁定操作',
        data: null,
      });
      return;
    }
    mockUsers = mockUsers.map((item) =>
      item.userId === idNum
        ? {
            ...item,
            lockedFlag: 1,
          }
        : item,
    );

    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },

  /**
   * 重置用户密码为默认密码 123456
   * PUT /api/user/:userId/reset-password
   */
  'PUT /api/user/:userId/reset-password': (req: Request, res: Response) => {
    const { userId } = req.params;
    const idNum = Number(userId);
    const user = mockUsers.find((item) => item.userId === idNum);
    if (user?.account === 'admin') {
      res.send({
        code: -1,
        msg: '不能对系统管理员进行重置密码操作',
        data: null,
      });
      return;
    }
    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },

  /**
   * 解锁用户
   * PUT /api/user/:userId/unlock
   */
  'PUT /api/user/:userId/unlock': (req: Request, res: Response) => {
    const { userId } = req.params;
    const idNum = Number(userId);
    const user = mockUsers.find((item) => item.userId === idNum);
    if (user?.account === 'admin') {
      res.send({
        code: -1,
        msg: '不能对系统管理员进行解锁操作',
        data: null,
      });
      return;
    }
    mockUsers = mockUsers.map((item) =>
      item.userId === idNum
        ? {
            ...item,
            lockedFlag: 0,
          }
        : item,
    );

    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },

  /**
   * 给用户分配角色
   * PUT /api/user/:userId/roles
   */
  'PUT /api/user/:userId/roles': (req: Request, res: Response) => {
    const { userId } = req.params;
    const idNum = Number(userId);
    const body: any = req.body || [];
    const roleIds: any[] = Array.isArray(body) ? body : [];

    mockUsers = mockUsers.map((item) =>
      item.userId === idNum
        ? {
            ...item,
            roles:
              roleIds.length > 0
                ? roleIds.map((id: any) => ({
                    roleId: Number(id),
                    roleName: `角色${id}`,
                  }))
                : [],
          }
        : item,
    );

    res.send({
      code: 0,
      msg: '请求成功',
      data: null,
    });
  },
};
