import { PlusOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  ProTable,
} from '@ant-design/pro-components';
import {
  App,
  Avatar,
  Button,
  Descriptions,
  Dropdown,
  Form,
  Modal,
  Upload,
  Popconfirm,
  Tag,
  Space,
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
  getUserDeptIds,
  lockUser,
  pageUsers,
  resetUserPassword,
  unlockUser,
  updateUser,
} from '@/services/ant-design-pro/user';
import { listDeptTree, type DeptItem } from '@/services/ant-design-pro/dept';
import { uploadAttach } from '@/services/ant-design-pro/attach';
import { pageRoles } from '@/services/ant-design-pro/role';

const Users: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createForm] = Form.useForm<UserForm>();
  const [currentRow, setCurrentRow] = useState<UserItem | undefined>();
  const [selectedRows, setSelectedRows] = useState<UserItem[]>([]);
  const [deptTree, setDeptTree] = useState<DeptItem[]>([]);
  const [editDeptIds, setEditDeptIds] = useState<string[]>([]);
  const editInitialValuesRef = useRef<Partial<UserForm> | null>(null);
  const [editForm] = Form.useForm<UserForm>();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailRow, setDetailRow] = useState<
    | (UserItem & {
        deptNames?: string[];
        avatarAttachId?: number;
        online?: boolean;
        loginSessions?: Array<{
          device?: string;
          ip?: string;
          browser?: string;
          loginTime?: string;
        }>;
      })
    | null
  >(null);
  const [createAvatarPreviewUrl, setCreateAvatarPreviewUrl] = useState<string | undefined>();
  const [editAvatarPreviewUrl, setEditAvatarPreviewUrl] = useState<string | undefined>();
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

  // 加载编辑用户的部门信息
  useEffect(() => {
    const loadUserDepts = async () => {
      if (editModalOpen && currentRow?.userId) {
        try {
          const res = await getUserDeptIds(currentRow.userId);
          if (res.code === 0 && res.data) {
            setEditDeptIds(res.data);
            editForm.setFieldsValue({ deptIds: res.data });
          }
        } catch (e) {
          console.error('加载用户部门失败', e);
          setEditDeptIds([]);
          editForm.setFieldsValue({ deptIds: [] });
        }
      } else {
        setEditDeptIds([]);
      }
    };
    loadUserDepts();
  }, [editModalOpen, currentRow?.userId, editForm]);

  // 打开编辑弹窗时回填基础字段（部门在另一个 effect 异步回填）
  useEffect(() => {
    if (editModalOpen && currentRow) {
      const avatarAttachId =
        currentRow.avatar?.attachId != null
          ? String(currentRow.avatar.attachId)
          : undefined;
      const initialValues: Partial<UserForm> = {
        userName: currentRow.userName,
        account: currentRow.account ?? '',
        gender: currentRow.gender,
        phone: currentRow.phone,
        email: currentRow.email,
        avatarAttachId,
        deptIds: editDeptIds ?? [],
        roleIds:
          currentRow.roles?.map((role) =>
            role.roleId != null ? role.roleId.toString() : role.roleName,
          ) ?? [],
      };
      editInitialValuesRef.current = initialValues;
      editForm.setFieldsValue(initialValues as UserForm);
      setEditAvatarPreviewUrl(getDisplayAvatarUrl(currentRow as any));
      return;
    }
    editInitialValuesRef.current = null;
    editForm.resetFields();
    setEditAvatarPreviewUrl(undefined);
  }, [editModalOpen, currentRow, editDeptIds, editForm]);

  const handleSubmit = async (values: UserForm, isEdit: boolean) => {
    const hide = message.loading(isEdit ? '正在保存用户信息' : '正在新增用户');
    try {
      let userId: string | undefined;

      if (isEdit && currentRow?.userId) {
        await updateUser(currentRow.userId, values);
        userId = currentRow.userId;
      } else {
        const res = await createUser(values);
        if (res.code !== 0 || !res.data) {
          throw new Error(res.msg || '新增用户失败');
        }
        // 后端返回的是 Long，这里统一转成字符串
        userId = res.data.toString();
      }

      // 处理角色分配（新增和编辑统一走后端 /user/{userId}/roles 接口）
      if (userId) {
        const { roleIds } = values;
        // 如果有选择角色就按选择的角色分配；如果没选且是编辑，则传空数组表示清空角色
        if ((roleIds && roleIds.length > 0) || isEdit) {
          const assignRes = await assignUserRoles(
            userId,
            (roleIds || []).map((id) => id?.toString?.() ?? id),
          );
          if (assignRes.code !== 0) {
            throw new Error(assignRes.msg || '分配角色失败');
          }
        }
      }
      hide();
      message.success(isEdit ? '保存成功' : '新增成功');
      setCreateModalOpen(false);
      setEditModalOpen(false);
      setCurrentRow(undefined);
      actionRef.current?.reload();
      return true;
    } catch (e) {
      hide();
      message.error(isEdit ? '保存失败，请稍后重试' : '新增失败，请稍后重试');
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
      message.success('密码已重置为 123456');
      actionRef.current?.reload();
    } catch (e) {
      hide();
      message.error('重置密码失败，请稍后重试');
    }
  };

  const handleShowDetail = async (row: UserItem) => {
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const res = await getUserDetail(row.userId);
      if (res.code === 0 && res.data) {
        const { deptIds, deptNames, ...rest } = res.data as any;
        setDetailRow({
          ...(row as any),
          ...rest,
          deptNames,
        });
      } else {
        message.error(res.msg || '加载用户详情失败');
      }
    } catch (e) {
      message.error('加载用户详情失败，请稍后重试');
    } finally {
      setDetailLoading(false);
    }
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
            onClick={() => {
              void handleShowDetail(record);
            }}
          >
            详情
          </a>,
          <a
            key="edit"
            onClick={() => {
              setCurrentRow(record);
              setEditModalOpen(true);
            }}
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
              setCurrentRow(undefined);
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

      <Modal
        title="用户详情"
        open={detailModalOpen}
        footer={null}
        confirmLoading={detailLoading}
        onCancel={() => {
          setDetailModalOpen(false);
          setDetailRow(null);
        }}
      >
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="头像">
            {getDisplayAvatarUrl(detailRow) ? (
              <Avatar
                src={getDisplayAvatarUrl(detailRow)}
                size={64}
                icon={<UserOutlined />}
              />
            ) : (
              <Avatar size={64} icon={<UserOutlined />} />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="用户姓名">
            {detailRow?.userName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="账号">
            {detailRow?.account || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="性别">
            {detailRow?.gender || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="手机号码">
            {detailRow?.phone || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="电子邮箱">
            {detailRow?.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="所属部门">
            {(() => {
              const names =
                (detailRow?.deptNames && detailRow.deptNames.length > 0
                  ? detailRow.deptNames
                  : detailRow?.depts?.map((d) => d.deptName)) || [];
              return names.length > 0
                ? names.map((name) => (
                    <Tag key={name} style={{ marginRight: 4 }}>
                      {name}
                    </Tag>
                  ))
                : '-';
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="角色">
            {detailRow?.roles && detailRow.roles.length > 0
              ? detailRow.roles.map((role) => {
                  const isAdmin = role.roleName === '系统管理员';
                  return (
                    <Tag
                      key={role.roleId ?? role.roleName}
                      color={isAdmin ? 'red' : undefined}
                      style={{ marginRight: 4 }}
                    >
                      {role.roleName}
                    </Tag>
                  );
                })
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="锁定状态">
            {detailRow?.lockedFlag ? (
              <Tag color="red">已锁定</Tag>
            ) : (
              <Tag color="green">正常</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="在线状态">
            {detailRow?.online ? (
              <Space>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#52c41a',
                    display: 'inline-block',
                  }}
                />
                <span>在线</span>
                {detailRow?.loginSessions && detailRow.loginSessions.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {detailRow.loginSessions.map((session, index) => (
                      <div key={index} style={{ marginTop: index > 0 ? 8 : 0 }}>
                        <div>
                          <strong>设备：</strong>
                          {session.device || '未知设备'}
                        </div>
                        <div>
                          <strong>IP：</strong>
                          {session.ip || '未知IP'}
                        </div>
                        <div>
                          <strong>浏览器：</strong>
                          {session.browser || '未知浏览器'}
                        </div>
                        {session.loginTime && (
                          <div>
                            <strong>登录时间：</strong>
                            {session.loginTime}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Space>
            ) : (
              <Space>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#d9d9d9',
                    display: 'inline-block',
                  }}
                />
                <span>离线</span>
              </Space>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {detailRow?.createdTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {detailRow?.updatedTime || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>

      <ModalForm<UserForm>
        title="新建用户"
        open={createModalOpen}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => {
            setCreateModalOpen(false);
            setCreateAvatarPreviewUrl(undefined);
            createForm.resetFields();
          },
        }}
        form={createForm}
        onFinish={async (values) => {
          return handleSubmit(values, false);
        }}
      >
        <Form.Item name="avatarAttachId" hidden>
          <input type="hidden" />
        </Form.Item>
        <Form.Item label="头像">
          <Upload
            showUploadList={false}
            beforeUpload={(file) =>
              handleAvatarUpload(file as any, createForm, setCreateAvatarPreviewUrl)
            }
          >
            <Avatar
              src={createAvatarPreviewUrl}
              size={64}
              icon={<UserOutlined />}
            />
          </Upload>
        </Form.Item>
        <ProFormText
          name="userName"
          label="用户姓名"
          rules={[{ required: true, message: '请输入用户姓名' }]}
        />
        <ProFormText
          name="account"
          label="账号"
          rules={[{ required: true, message: '请输入账号' }]}
        />
        <ProFormSelect
          name="gender"
          label="性别"
          valueEnum={{
            男: '男',
            女: '女',
          }}
        />
        <ProFormText name="phone" label="手机号码" />
        <ProFormText name="email" label="电子邮箱" />
        <ProFormTreeSelect
          name="deptIds"
          label="部门"
          placeholder="请选择部门"
          fieldProps={{
            multiple: true,
            treeData: convertDeptTreeToOptions(deptTree),
            treeCheckable: true,
            showCheckedStrategy: 'SHOW_ALL',
            allowClear: true,
          }}
        />
        <ProFormSelect
          name="roleIds"
          label="角色"
          placeholder="请选择角色"
          fieldProps={{
            mode: 'multiple',
          }}
          request={async () => {
            try {
              const res = await pageRoles({ pageNum: 1, pageSize: 100 });
              if (res.code !== 0 || !res.data) {
                return [];
              }
              return res.data.list.map((role) => ({
                label: role.roleName,
                value: role.roleId != null ? role.roleId.toString() : role.roleName,
              }));
            } catch {
              return [];
            }
          }}
        />
      </ModalForm>

      <ModalForm<UserForm>
        title="编辑用户"
        open={editModalOpen}
        form={editForm}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => {
            setEditModalOpen(false);
            setCurrentRow(undefined);
            setEditDeptIds([]);
            editInitialValuesRef.current = null;
            editForm.resetFields();
            setEditAvatarPreviewUrl(undefined);
          },
        }}
        onFinish={async (values) => {
          return handleSubmit(values, true);
        }}
      >
        <Form.Item name="avatarAttachId" hidden>
          <input type="hidden" />
        </Form.Item>
        <Form.Item label="头像">
          <Upload
            showUploadList={false}
            beforeUpload={(file) =>
              handleAvatarUpload(file as any, editForm, setEditAvatarPreviewUrl)
            }
          >
            <Avatar
              src={editAvatarPreviewUrl}
              size={64}
              icon={<UserOutlined />}
            />
          </Upload>
        </Form.Item>
        <ProFormText
          name="userName"
          label="用户姓名"
          rules={[{ required: true, message: '请输入用户姓名' }]}
        />
        <ProFormText
          name="account"
          label="账号"
          rules={[{ required: true, message: '请输入账号' }]}
        />
        <ProFormSelect
          name="gender"
          label="性别"
          valueEnum={{
            男: '男',
            女: '女',
          }}
        />
        <ProFormText name="phone" label="手机号码" />
        <ProFormText name="email" label="电子邮箱" />
        <ProFormTreeSelect
          name="deptIds"
          label="部门"
          placeholder="请选择部门"
          fieldProps={{
            multiple: true,
            treeData: convertDeptTreeToOptions(deptTree),
            treeCheckable: true,
            showCheckedStrategy: 'SHOW_ALL',
            allowClear: true,
          }}
        />
        <ProFormSelect
          name="roleIds"
          label="角色"
          placeholder="请选择角色"
          fieldProps={{
            mode: 'multiple',
          }}
          request={async () => {
            try {
              const res = await pageRoles({ pageNum: 1, pageSize: 100 });
              if (res.code !== 0 || !res.data) {
                return [];
              }
              return res.data.list.map((role) => ({
                label: role.roleName,
                value: role.roleId != null ? role.roleId.toString() : role.roleName,
              }));
            } catch {
              return [];
            }
          }}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default Users;
