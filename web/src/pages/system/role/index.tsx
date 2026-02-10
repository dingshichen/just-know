import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type {
  RoleItem,
  RolePageParams,
} from '@/services/role';
import {
  batchDeleteRoles,
  deleteRole,
  pageRoles,
} from '@/services/role';
import RoleDetailModal from './detail';
import RoleCreateModal from './create';
import RoleEditModal from './edit';

const Roles: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | undefined>();
  const [selectedRows, setSelectedRows] = useState<RoleItem[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { message } = App.useApp();

  const handleDelete = async (row: RoleItem) => {
    const hide = message.loading('正在删除角色');
    try {
      await deleteRole(row.roleId);
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
      message.warning('请先选择要删除的角色');
      return;
    }
    const hide = message.loading('正在批量删除角色');
    try {
      await batchDeleteRoles(selectedRows.map((item) => item.roleId));
      hide();
      message.success('批量删除成功');
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
    } catch (e) {
      hide();
      message.error('批量删除失败，请稍后重试');
    }
  };

  const handleShowDetail = (roleId: string) => {
    setCurrentId(roleId);
    setDetailModalOpen(true);
  };

  const handleShowEdit = (roleId: string) => {
    setCurrentId(roleId);
    setEditModalOpen(true);
  };

  const columns: ProColumns<RoleItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      valueType: 'textarea',
      search: false,
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
          key="detail"
          onClick={() => handleShowDetail(record.roleId)}
        >
          详情
        </a>,
        <a
          key="edit"
          onClick={() => handleShowEdit(record.roleId)}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确定要删除该角色吗？"
          onConfirm={() => handleDelete(record)}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<RoleItem, RolePageParams>
        headerTitle="角色管理"
        rowKey="roleId"
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
            <PlusOutlined /> 新建角色
          </Button>,
          selectedRows.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title={`确定要删除选中的 ${selectedRows.length} 个角色吗？`}
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
          const res = await pageRoles({
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

      <RoleCreateModal
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
        }}
        onSubmit={() => {
          setCreateModalOpen(false);
          actionRef.current?.reload();
        }}
      />

      {currentId && (
        <RoleDetailModal
          roleId={currentId}
          open={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
          }}
        />
      )}

      {currentId && (
        <RoleEditModal
          roleId={currentId}
          open={editModalOpen}
          onCancel={() => {
            setEditModalOpen(false);
            setCurrentId(undefined);
          }}
          onSubmit={() => {
            setEditModalOpen(false);
            setCurrentId(undefined);
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};

export default Roles;
