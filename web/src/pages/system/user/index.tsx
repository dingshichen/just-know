import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import {
  App,
  Avatar,
  Button,
  Dropdown,
  Modal,
  Popconfirm,
  Tag,
} from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  assignUserRoles,
  type UserForm,
  type UserItem,
  type UserPageParams,
} from '@/services/ant-design-pro/user';
import {
  batchDeleteUsers,
  createUser,
  deleteUser,
  getUserDetail,
  lockUser,
  pageUsers,
  resetUserPassword,
  unlockUser,
  updateUser,
} from '@/services/ant-design-pro/user';
import { listDeptTree, type DeptItem } from '@/services/ant-design-pro/dept';
import { uploadAttach } from '@/services/ant-design-pro/attach';
import { pageRoles } from '@/services/ant-design-pro/role';
import UserDetailModal from './detail';
import UserCreateModal from './create';
import UserEditModal from './edit';

const Users: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | undefined>();
  const [selectedRows, setSelectedRows] = useState<UserItem[]>([]);
  const [deptTree, setDeptTree] = useState<DeptItem[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { message } = App.useApp();

  /** 根据附件ID生成头像展示/预览地址（同源，走代理） */
  const getAvatarUrl = (attachId: string) => `/api/attach/download/${attachId}`;

  /** 从用户项（含 avatar: AttachOption）或详情中解析出头像展示 URL */
  const getDisplayAvatarUrl = (row: { avatar?: { attachId?: string } } | null) => {
    if (!row) return undefined;
    if (row.avatar?.attachId != null) return getAvatarUrl(row.avatar.attachId);
    return undefined;
  };

  // 加载部门树形数据
  useEffect(() => {
    const loadDeptTree = async () => {
      try {
        const res = await listDeptTree();
        if (res.code === 0 && res.data) {
          setDeptTree(res.data);
        }
      } catch (e) {
        console.error('加载部门树失败', e);
      }
    };
    loadDeptTree();
  }, []);

  // 将部门树转换为TreeSelect需要的格式
  const convertDeptTreeToOptions = (tree: DeptItem[]): any[] => {
    return tree.map((item) => ({
      title: item.deptName,
      value: item.deptId,
      key: item.deptId,
      children: item.children ? convertDeptTreeToOptions(item.children) : undefined,
    }));
  };

  const handleCreateSubmit = async (values: UserForm) => {
    const hide = message.loading('正在新增用户');
    try {
      const res = await createUser(values);
      if (res.code !== 0 || !res.data) {
        throw new Error(res.msg || '新增用户失败');
      }
      // 后端返回的是 Long，这里统一转成字符串
      const userId = res.data.toString();

      // 处理角色分配
      const { roleIds } = values;
      if (roleIds && roleIds.length > 0) {
        const assignRes = await assignUserRoles(
          userId,
          roleIds.map((id) => id?.toString?.() ?? id),
        );
        if (assignRes.code !== 0) {
          throw new Error(assignRes.msg || '分配角色失败');
        }
      }
      hide();
      message.success('新增成功');
      setCreateModalOpen(false);
      actionRef.current?.reload();
      return true;
    } catch (e) {
      hide();
      message.error('新增失败，请稍后重试');
      return false;
    }
  };

  const handleUpdateSubmit = async (values: UserForm) => {
    if (!currentId) {
      message.error('用户ID不存在');
      return false;
    }
    const hide = message.loading('正在保存用户信息');
    try {
      await updateUser(currentId, values);

      // 处理角色分配（如果有选择角色就按选择的角色分配；如果没选则传空数组表示清空角色）
      const { roleIds } = values;
      const assignRes = await assignUserRoles(
        currentId,
        (roleIds || []).map((id) => id?.toString?.() ?? id),
      );
      if (assignRes.code !== 0) {
        throw new Error(assignRes.msg || '分配角色失败');
      }
      hide();
      message.success('保存成功');
      setEditModalOpen(false);
      setCurrentId(undefined);
      actionRef.current?.reload();
      return true;
    } catch (e) {
      hide();
      message.error('保存失败，请稍后重试');
      return false;
    }
  };

  const handleDelete = async (row: UserItem) => {
    const hide = message.loading('正在删除用户');
    try {
      const res = await deleteUser(row.userId);
      hide();
      if (res.code !== 0) {
        message.error(res.msg || '删除失败，请稍后重试');
        return;
      }
      message.success('删除成功');
      actionRef.current?.reloadAndRest?.();
    } catch (e) {
      hide();
      message.error('删除失败，请稍后重试');
    }
  };

  const handleBatchDelete = async () => {
    if (!selectedRows.length) {
      message.warning('请先选择要删除的用户');
      return;
    }
    const toDelete = selectedRows.filter((item) => item.account !== 'admin');
    if (toDelete.length === 0) {
      message.warning('不能删除系统管理员，请重新选择');
      return;
    }
    if (toDelete.length < selectedRows.length) {
      message.info('已排除系统管理员，仅删除所选其他用户');
    }
    const hide = message.loading('正在批量删除用户');
    try {
      const res = await batchDeleteUsers(toDelete.map((item) => item.userId));
      hide();
      if (res.code !== 0) {
        message.error(res.msg || '批量删除失败，请稍后重试');
        return;
      }
      message.success('批量删除成功');
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
    } catch (e) {
      hide();
      message.error('批量删除失败，请稍后重试');
    }
  };

  const handleToggleLock = async (row: UserItem) => {
    const isLocked = row.lockedFlag === true;
    const hide = message.loading(isLocked ? '正在解锁用户' : '正在锁定用户');
    try {
      const res = isLocked
        ? await unlockUser(row.userId)
        : await lockUser(row.userId);
      hide();
      if (res.code !== 0) {
        message.error(res.msg || (isLocked ? '解锁失败，请稍后重试' : '锁定失败，请稍后重试'));
        return;
      }
      message.success(row.lockedFlag ? '解锁成功' : '锁定成功');
      actionRef.current?.reload();
    } catch (e) {
      hide();
      message.error(isLocked ? '解锁失败，请稍后重试' : '锁定失败，请稍后重试');
    }
  };

  const handleResetPassword = async (row: UserItem) => {
    const hide = message.loading('正在重置密码');
    try {
      const res = await resetUserPassword(row.userId);
      hide();
      if (res.code !== 0) {
        message.error(res.msg || '重置密码失败，请稍后重试');
        return;
      }
      message.success('密码已重置');
      actionRef.current?.reload();
    } catch (e) {
      hide();
      message.error('重置密码失败，请稍后重试');
    }
  };

  const handleShowDetail = async (userId: string) => {
    setCurrentId(userId);
    setDetailModalOpen(true);
  };

  const handleShowEdit = async (userId: string) => {
    setCurrentId(userId);
    setEditModalOpen(true);
  };

  const handleAvatarUpload = async (
    file: File,
    form: any,
    setPreview: (url: string | undefined) => void,
  ) => {
    try {
      const res = await uploadAttach(file);
      if (res.code !== 0 || !res.data) {
        message.error(res.msg || '上传头像失败，请稍后重试');
        return false;
      }
      const attach = res.data;
      const attachId = attach.attachId?.toString?.() ?? attach.attachId;
      // 保存附件ID到表单（隐藏项会随表单提交）
      form.setFieldsValue({
        avatarAttachId: attachId,
      } as any);
      // 使用同源下载地址作为预览，确保能正确展示
      const url = getAvatarUrl(attach.attachId);
      setPreview(url);
      message.success('头像上传成功');
      return false; // 阻止 Upload 组件自动上传
    } catch (e) {
      message.error('上传头像失败，请稍后重试');
      return false;
    }
  };

  const columns: ProColumns<UserItem>[] = [
    {
      title: '头像',
      dataIndex: 'avatar',
      search: false,
      width: 72,
      render: (_, record) => {
        const size = 40;
        const src = getDisplayAvatarUrl(record as any);
        if (src) {
          return (
            <Avatar
              src={src}
              size={size}
              style={{ verticalAlign: 'middle' }}
            />
          );
        }
        return (
          <Avatar
            icon={<UserOutlined />}
            size={size}
            style={{ verticalAlign: 'middle' }}
          />
        );
      },
    },
    {
      title: '用户姓名',
      dataIndex: 'userName',
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '角色',
      dataIndex: 'roleIds',
      valueType: 'select',
      hideInTable: true,
      fieldProps: {
        mode: 'multiple',
        placeholder: '请选择角色',
      },
      request: async () => {
        try {
          const res = await pageRoles({ pageNum: 1, pageSize: 100 });
          if (res.code !== 0 || !res.data) return [];
          return res.data.list.map((role) => ({
            label: role.roleName,
            value: role.roleId != null ? role.roleId.toString() : role.roleName,
          }));
        } catch {
          return [];
        }
      },
    },
    {
      title: '部门',
      dataIndex: 'deptIds',
      valueType: 'treeSelect',
      hideInTable: true,
      fieldProps: {
        multiple: true,
        placeholder: '请选择部门',
        treeData: convertDeptTreeToOptions(deptTree),
        treeCheckable: true,
        showCheckedStrategy: 'SHOW_ALL',
        allowClear: true,
      },
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      hideInTable: true,
    },
    {
      title: '部门',
      dataIndex: 'depts',
      search: false,
      render: (_, record) => {
        if (record.depts && record.depts.length > 0) {
          return record.depts.map((dept, index) => (
            <Tag key={index} style={{ marginRight: 4 }}>
              {dept.deptName}
            </Tag>
          ));
        }
        return '-';
      },
    },
    {
      title: '角色',
      dataIndex: 'roles',
      search: false,
      render: (_, record) => {
        if (record.roles && record.roles.length > 0) {
          return record.roles.map((role, index) => {
            const isAdmin = role.roleName === '系统管理员';
            return (
              <Tag
                key={role.roleId ?? index}
                color={isAdmin ? 'red' : undefined}
                style={{ marginRight: 4 }}
              >
                {role.roleName}
              </Tag>
            );
          });
        }
        return '-';
      },
    },
    {
      title: '锁定状态',
      dataIndex: 'lockedFlag',
      valueType: 'select',
      valueEnum: {
        true: { text: '已锁定', status: 'Error' },
        false: { text: '正常', status: 'Success' },
      },
      render: (_, record) =>
        record.lockedFlag ? (
          <Tag color="red">已锁定</Tag>
        ) : (
          <Tag color="green">正常</Tag>
        ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        const isSystemAdmin = record.account === 'admin';
        const moreItems: MenuProps['items'] = !isSystemAdmin
          ? [
              {
                key: 'lock',
                label: record.lockedFlag ? '解锁' : '锁定',
                onClick: () => {
                  Modal.confirm({
                    title: record.lockedFlag ? '确定要解锁该用户吗？' : '确定要锁定该用户吗？',
                    onOk: () => handleToggleLock(record),
                  });
                },
              },
              {
                key: 'resetPassword',
                label: '重置密码',
                onClick: () => {
                  Modal.confirm({
                    title: '确定要将该用户密码重置为 123456 吗？',
                    onOk: () => handleResetPassword(record),
                  });
                },
              },
              { type: 'divider' },
              {
                key: 'delete',
                danger: true,
                label: '删除',
                onClick: () => {
                  Modal.confirm({
                    title: '确定要删除该用户吗？',
                    okText: '确定',
                    okType: 'danger',
                    onOk: () => handleDelete(record),
                  });
                },
              },
            ]
          : [];
        return [
          <a
            key="detail"
            onClick={() => handleShowDetail(record.userId) }
          >
            详情
          </a>,
          <a
            key="edit"
            onClick={() => handleShowEdit(record.userId) }
          >
            编辑
          </a>,
          moreItems.length > 0 ? (
            <Dropdown key="more" menu={{ items: moreItems }} trigger={['click']}>
              <a onClick={(e) => e.preventDefault()}>
                更多 <DownOutlined />
              </a>
            </Dropdown>
          ) : null,
        ];
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<UserItem, UserPageParams>
        headerTitle="用户管理"
        rowKey="userId"
        actionRef={actionRef}
        columns={columns}
        search={{
          labelWidth: 100,
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => {
              setCurrentId(undefined);
              setCreateModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建用户
          </Button>,
          selectedRows.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title={`确定要删除选中的 ${selectedRows.length} 个用户吗？`}
              onConfirm={handleBatchDelete}
            >
              <Button danger>批量删除</Button>
            </Popconfirm>
          ),
        ]}
        rowSelection={{
          onChange: (_, rows) => {
            setSelectedRows(rows);
          },
        }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await pageUsers({
            pageNum: current,
            pageSize,
            ...rest,
          });
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0,
          };
        }}
        pagination={{
          pageSize: 10,
        }}
      />

      <UserCreateModal
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
        }}
        handleSubmit={handleCreateSubmit}
        handleAvatarUpload={handleAvatarUpload}
        deptTree={convertDeptTreeToOptions(deptTree)}
      />

      {
        currentId && (
          <UserDetailModal
            userId={currentId}
            open={detailModalOpen}
            onClose={() => {
              setDetailModalOpen(false);
            }}
          />
        )
      }

      {
        currentId && (
          <UserEditModal
            userId={currentId}
            open={editModalOpen}
            onCancel={() => {
              setEditModalOpen(false);
            }}
            handleSubmit={handleUpdateSubmit}
            handleAvatarUpload={handleAvatarUpload}
            deptTree={convertDeptTreeToOptions(deptTree)}
          />
        )
      }
      
    </PageContainer>
  );
};

export default Users;
