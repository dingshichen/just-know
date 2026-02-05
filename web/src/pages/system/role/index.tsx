import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Descriptions, Modal, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type {
  RoleForm,
  RoleItem,
  RolePageParams,
} from '@/services/ant-design-pro/role';
import {
  batchDeleteRoles,
  createRole,
  deleteRole,
  getRoleDetail,
  pageRoles,
  updateRole,
} from '@/services/ant-design-pro/role';

const Roles: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<RoleItem | undefined>();
  const [selectedRows, setSelectedRows] = useState<RoleItem[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailRow, setDetailRow] = useState<RoleItem | undefined>();

  const handleSubmit = async (values: RoleForm, isEdit: boolean) => {
    const hide = message.loading(isEdit ? '正在保存角色信息' : '正在新增角色');
    try {
      if (isEdit && currentRow?.roleId) {
        await updateRole(currentRow.roleId, values);
      } else {
        await createRole(values);
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

  const handleShowDetail = async (record: RoleItem) => {
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const res = await getRoleDetail(record.roleId);
      if (res.code === 0 && res.data) {
        setDetailRow(res.data);
      } else {
        message.error(res.msg || '加载角色详情失败');
      }
    } catch (e) {
      message.error('加载角色详情失败，请稍后重试');
    } finally {
      setDetailLoading(false);
    }
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
              setCurrentRow(undefined);
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

      <Modal
        title="角色详情"
        open={detailModalOpen}
        footer={null}
        onCancel={() => {
          setDetailModalOpen(false);
          setDetailRow(undefined);
        }}
      >
        <Descriptions column={1} bordered size="small" loading={detailLoading}>
          <Descriptions.Item label="角色名称">
            {detailRow?.roleName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="角色编码">
            {detailRow?.roleCode || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="角色描述">
            {detailRow?.roleDesc || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {detailRow?.createdTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {detailRow?.updatedTime || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>

      <ModalForm<RoleForm>
        title="新建角色"
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
          name="roleName"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        />
        <ProFormText
          name="roleCode"
          label="角色编码"
          rules={[{ required: true, message: '请输入角色编码' }]}
        />
        <ProFormTextArea name="roleDesc" label="角色描述" />
      </ModalForm>

      <ModalForm<RoleForm>
        title="编辑角色"
        open={editModalOpen}
        initialValues={{
          roleName: currentRow?.roleName,
          roleCode: currentRow?.roleCode,
          roleDesc: currentRow?.roleDesc,
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
          name="roleName"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        />
        <ProFormText
          name="roleCode"
          label="角色编码"
          rules={[{ required: true, message: '请输入角色编码' }]}
        />
        <ProFormTextArea name="roleDesc" label="角色描述" />
      </ModalForm>
    </PageContainer>
  );
};

export default Roles;

