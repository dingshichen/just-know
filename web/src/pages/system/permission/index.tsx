import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Descriptions, Modal, message, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type {
  PermissionForm,
  PermissionItem,
  PermissionPageParams,
} from '@/services/permission';
import {
  batchDeletePermissions,
  createPermission,
  deletePermission,
  getPermissionDetail,
  pagePermissions,
  updatePermission,
} from '@/services/permission';
import { listSystemConfigs } from '@/services/systemConfig';

const Permissions: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<PermissionItem | undefined>();
  const [selectedRows, setSelectedRows] = useState<PermissionItem[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailRow, setDetailRow] = useState<PermissionItem | undefined>();
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

  const handleSubmit = async (values: PermissionForm, isEdit: boolean) => {
    const hide = message.loading(isEdit ? '正在保存权限信息' : '正在新增权限');
    try {
      if (isEdit && currentRow?.permissionId) {
        await updatePermission(currentRow.permissionId, values);
      } else {
        const res = await createPermission(values);
        if (res.code !== 0 || res.data == null) {
          throw new Error(res.msg || '新增权限失败');
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

  const handleShowDetail = async (record: PermissionItem) => {
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const res = await getPermissionDetail(record.permissionId);
      if (res.code === 0 && res.data) {
        setDetailRow(res.data);
      } else {
        message.error(res.msg || '加载权限详情失败');
      }
    } catch (e) {
      message.error('加载权限详情失败，请稍后重试');
    } finally {
      setDetailLoading(false);
    }
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
          onClick={() => {
            void handleShowDetail(record);
          }}
        >
          详情
        </a>,
        allowOnlineOperation && (
          <a
            key="edit"
            onClick={() => {
              setCurrentRow(record);
              setEditModalOpen(true);
            }}
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
                setCurrentRow(undefined);
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

      <Modal
        title="权限详情"
        open={detailModalOpen}
        footer={null}
        onCancel={() => {
          setDetailModalOpen(false);
          setDetailRow(undefined);
        }}
      >
        <Descriptions column={1} bordered size="small" loading={detailLoading}>
          <Descriptions.Item label="权限名称">
            {detailRow?.permissionName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="权限编码">
            {detailRow?.permissionCode || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {detailRow?.createdTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {detailRow?.updatedTime || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>

      <ModalForm<PermissionForm>
        title="新建权限"
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
          name="permissionName"
          label="权限名称"
          rules={[{ required: true, message: '请输入权限名称' }]}
        />
        <ProFormText
          name="permissionCode"
          label="权限编码"
          rules={[{ required: true, message: '请输入权限编码' }]}
        />
      </ModalForm>

      <ModalForm<PermissionForm>
        title="编辑权限"
        open={editModalOpen}
        initialValues={{
          permissionName: currentRow?.permissionName,
          permissionCode: currentRow?.permissionCode,
        }}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => {
            setEditModalOpen(false);
            setCurrentRow(undefined);
          },
        }}
        onFinish={async (values) => {
          return handleSubmit(values, true);
        }}
      >
        <ProFormText
          name="permissionName"
          label="权限名称"
          rules={[{ required: true, message: '请输入权限名称' }]}
        />
        <ProFormText
          name="permissionCode"
          label="权限编码"
          rules={[{ required: true, message: '请输入权限编码' }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default Permissions;
