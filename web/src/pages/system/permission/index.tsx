import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type {
  PermissionItem,
  PermissionPageParams,
} from '@/services/permission';
import {
  batchDeletePermissions,
  deletePermission,
  pagePermissions,
} from '@/services/permission';
import { listSystemConfigs } from '@/services/systemConfig';
import PermissionDetailModal from './detail';
import PermissionCreateModal from './create';
import PermissionEditModal from './edit';

const Permissions: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | undefined>();
  const [selectedRows, setSelectedRows] = useState<PermissionItem[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [allowOnlineOperation, setAllowOnlineOperation] = useState(true);

  // 获取系统配置：是否允许线上操作权限定义
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await listSystemConfigs();
        if (res.code === 0 && res.data) {
          const config = res.data.find(
            (item) => item.configKey === 'permission.allow_online_operation',
          );
          if (config) {
            setAllowOnlineOperation(config.configValue === 'true');
          }
        }
      } catch (e) {
        console.error('获取系统配置失败', e);
        // 默认允许操作
        setAllowOnlineOperation(true);
      }
    };
    void fetchConfig();
  }, []);

  const handleDelete = async (row: PermissionItem) => {
    const hide = message.loading('正在删除权限');
    try {
      await deletePermission(row.permissionId);
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
      message.warning('请先选择要删除的权限');
      return;
    }
    const hide = message.loading('正在批量删除权限');
    try {
      await batchDeletePermissions(selectedRows.map((item) => item.permissionId));
      hide();
      message.success('批量删除成功');
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
    } catch (e) {
      hide();
      message.error('批量删除失败，请稍后重试');
    }
  };

  const handleShowDetail = (permissionId: string) => {
    setCurrentId(permissionId);
    setDetailModalOpen(true);
  };

  const handleShowEdit = (permissionId: string) => {
    setCurrentId(permissionId);
    setEditModalOpen(true);
  };

  const columns: ProColumns<PermissionItem>[] = [
    {
      title: '权限名称',
      dataIndex: 'permissionName',
    },
    {
      title: '权限编码',
      dataIndex: 'permissionCode',
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
          onClick={() => handleShowDetail(record.permissionId)}
        >
          详情
        </a>,
        allowOnlineOperation && (
          <a
            key="edit"
            onClick={() => handleShowEdit(record.permissionId)}
          >
            编辑
          </a>
        ),
        allowOnlineOperation && (
          <Popconfirm
            key="delete"
            title="确定要删除该权限吗？"
            onConfirm={() => handleDelete(record)}
          >
            <a>删除</a>
          </Popconfirm>
        ),
      ].filter(Boolean),
    },
  ];

  return (
    <PageContainer>
      <ProTable<PermissionItem, PermissionPageParams>
        headerTitle="权限定义"
        rowKey="permissionId"
        actionRef={actionRef}
        columns={columns}
        search={{
          labelWidth: 100,
        }}
        toolBarRender={() => [
          allowOnlineOperation && (
            <Button
              key="add"
              type="primary"
              onClick={() => {
                setCurrentId(undefined);
                setCreateModalOpen(true);
              }}
            >
              <PlusOutlined /> 新建权限
            </Button>
          ),
          allowOnlineOperation &&
            selectedRows.length > 0 && (
              <Popconfirm
                key="batchDelete"
                title={`确定要删除选中的 ${selectedRows.length} 个权限吗？`}
                onConfirm={handleBatchDelete}
              >
                <Button danger>批量删除</Button>
              </Popconfirm>
            ),
        ].filter(Boolean)}
        rowSelection={
          allowOnlineOperation
            ? {
                onChange: (_, rows) => {
                  setSelectedRows(rows);
                },
              }
            : undefined
        }
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const res = await pagePermissions({
            pageNum: current,
            pageSize,
            ...rest,
          });
          const list = (res.data?.list || []).map((item: any) => ({
            ...item,
            permissionId: item.permissionId != null ? String(item.permissionId) : item.permissionId,
          }));
          return {
            data: list,
            success: res.code === 0,
            total: res.data?.total || 0,
          };
        }}
        pagination={{
          pageSize: 10,
        }}
      />

      <PermissionCreateModal
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
        <PermissionDetailModal
          permissionId={currentId}
          open={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
          }}
        />
      )}

      {currentId && (
        <PermissionEditModal
          permissionId={currentId}
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

export default Permissions;
