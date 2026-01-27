import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { UserForm, UserItem, UserPageParams } from '@/services/ant-design-pro/user';
import {
  batchDeleteUsers,
  createUser,
  deleteUser,
  getUserDeptIds,
  lockUser,
  pageUsers,
  unlockUser,
  updateUser,
} from '@/services/ant-design-pro/user';
import { listDeptTree, type DeptItem } from '@/services/ant-design-pro/dept';

const Users: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<UserItem | undefined>();
  const [selectedRows, setSelectedRows] = useState<UserItem[]>([]);
  const [deptTree, setDeptTree] = useState<DeptItem[]>([]);
  const [editDeptIds, setEditDeptIds] = useState<number[]>([]);

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
          }
        } catch (e) {
          console.error('加载用户部门失败', e);
          setEditDeptIds([]);
        }
      } else {
        setEditDeptIds([]);
      }
    };
    loadUserDepts();
  }, [editModalOpen, currentRow?.userId]);

  const handleSubmit = async (values: UserForm, isEdit: boolean) => {
    const hide = message.loading(isEdit ? '正在保存用户信息' : '正在新增用户');
    try {
      if (isEdit && currentRow?.userId) {
        await updateUser(currentRow.userId, values);
      } else {
        await createUser(values);
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
      await deleteUser(row.userId);
      hide();
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
    const hide = message.loading('正在批量删除用户');
    try {
      await batchDeleteUsers(selectedRows.map((item) => item.userId));
      hide();
      message.success('批量删除成功');
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
    } catch (e) {
      hide();
      message.error('批量删除失败，请稍后重试');
    }
  };

  const handleToggleLock = async (row: UserItem) => {
    const isLocked = row.lockedFlag === 1;
    const hide = message.loading(isLocked ? '正在解锁用户' : '正在锁定用户');
    try {
      if (isLocked) {
        await unlockUser(row.userId);
      } else {
        await lockUser(row.userId);
      }
      hide();
      message.success(isLocked ? '解锁成功' : '锁定成功');
      actionRef.current?.reload();
    } catch (e) {
      hide();
      message.error(isLocked ? '解锁失败，请稍后重试' : '锁定失败，请稍后重试');
    }
  };

  const columns: ProColumns<UserItem>[] = [
    {
      title: '用户姓名',
      dataIndex: 'userName',
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueType: 'select',
      valueEnum: {
        男: { text: '男' },
        女: { text: '女' },
      },
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
    },
    {
      title: '部门',
      dataIndex: 'deptNames',
      search: false,
      render: (_, record) => {
        if (record.deptNames && record.deptNames.length > 0) {
          return record.deptNames.map((name, index) => (
            <Tag key={index} style={{ marginRight: 4 }}>
              {name}
            </Tag>
          ));
        }
        return '-';
      },
    },
    {
      title: '锁定状态',
      dataIndex: 'lockedFlag',
      valueType: 'select',
      valueEnum: {
        0: { text: '正常', status: 'Success' },
        1: { text: '已锁定', status: 'Error' },
      },
      render: (_, record) =>
        record.lockedFlag === 1 ? (
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
      title: '更新时间',
      dataIndex: 'updatedTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentRow(record);
            setEditModalOpen(true);
          }}
        >
          编辑
        </a>,
        <a
          key="lock"
          onClick={() => {
            handleToggleLock(record);
          }}
        >
          {record.lockedFlag === 1 ? '解锁' : '锁定'}
        </a>,
        <Popconfirm
          key="delete"
          title="确定要删除该用户吗？"
          onConfirm={() => handleDelete(record)}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
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

      <ModalForm<UserForm>
        title="新建用户"
        open={createModalOpen}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => setCreateModalOpen(false),
        }}
        onFinish={async (values) => {
          return handleSubmit(values, false);
        }}
      >
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
      </ModalForm>

      <ModalForm<UserForm>
        title="编辑用户"
        open={editModalOpen}
        initialValues={{
          userName: currentRow?.userName,
          account: currentRow?.account,
          gender: currentRow?.gender,
          phone: currentRow?.phone,
          email: currentRow?.email,
          deptIds: editDeptIds,
        }}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => {
            setEditModalOpen(false);
            setCurrentRow(undefined);
            setEditDeptIds([]);
          },
        }}
        onFinish={async (values) => {
          return handleSubmit(values, true);
        }}
      >
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
      </ModalForm>
    </PageContainer>
  );
};

export default Users;
