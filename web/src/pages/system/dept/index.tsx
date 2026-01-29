import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Descriptions, Modal, message, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { DeptForm, DeptItem } from '@/services/ant-design-pro/dept';
import {
  batchDeleteDepts,
  createDept,
  deleteDept,
  getDeptDetail,
  listDeptTree,
  updateDept,
} from '@/services/ant-design-pro/dept';

const Dept: React.FC = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<DeptItem | undefined>();
  const [selectedRows, setSelectedRows] = useState<DeptItem[]>([]);
  const [treeData, setTreeData] = useState<DeptItem[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailRow, setDetailRow] = useState<DeptItem | null>(null);

  // 加载树形数据
  useEffect(() => {
    loadTreeData();
  }, []);

  const loadTreeData = async () => {
    try {
      const res = await listDeptTree();
      if (res.code === 0 && res.data) {
        setTreeData(res.data);
      }
    } catch (e) {
      console.error('加载机构树失败', e);
    }
  };

  // 将树形数据转换为选项格式
  const convertTreeToOptions = (tree: DeptItem[]): any[] => {
    return tree.map((item) => ({
      title: item.deptName,
      value: item.deptId,
      children: item.children ? convertTreeToOptions(item.children) : undefined,
    }));
  };

  const handleSubmit = async (values: DeptForm, isEdit: boolean) => {
    const hide = message.loading(isEdit ? '正在保存机构信息' : '正在新增机构');
    try {
      if (isEdit && currentRow?.deptId) {
        await updateDept(currentRow.deptId, values);
      } else {
        await createDept(values);
      }
      hide();
      message.success(isEdit ? '保存成功' : '新增成功');
      setCreateModalOpen(false);
      setEditModalOpen(false);
      setCurrentRow(undefined);
      loadTreeData();
      actionRef.current?.reload();
      return true;
    } catch (e) {
      hide();
      message.error(isEdit ? '保存失败，请稍后重试' : '新增失败，请稍后重试');
      return false;
    }
  };

  const handleDelete = async (row: DeptItem) => {
    const hide = message.loading('正在删除机构');
    try {
      await deleteDept(row.deptId);
      hide();
      message.success('删除成功');
      loadTreeData();
      actionRef.current?.reloadAndRest?.();
    } catch (e: any) {
      hide();
      message.error(e?.msg || '删除失败，请稍后重试');
    }
  };

  const handleBatchDelete = async () => {
    if (!selectedRows.length) {
      message.warning('请先选择要删除的机构');
      return;
    }
    const hide = message.loading('正在批量删除机构');
    try {
      await batchDeleteDepts(selectedRows.map((item) => item.deptId));
      hide();
      message.success('批量删除成功');
      setSelectedRows([]);
      loadTreeData();
      actionRef.current?.reloadAndRest?.();
    } catch (e) {
      hide();
      message.error('批量删除失败，请稍后重试');
    }
  };

  const handleShowDetail = async (row: DeptItem) => {
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const res = await getDeptDetail(row.deptId);
      if (res.code === 0 && res.data) {
        setDetailRow(res.data);
      } else {
        message.error(res.msg || '加载机构详情失败');
      }
    } catch (e) {
      message.error('加载机构详情失败，请稍后重试');
    } finally {
      setDetailLoading(false);
    }
  };

  const columns: ProColumns<DeptItem>[] = [
    {
      title: '机构名称',
      dataIndex: 'deptName',
      width: 200,
    },
    {
      title: '机构编码',
      dataIndex: 'deptCode',
      width: 150,
    },
    {
      title: '机构描述',
      dataIndex: 'deptDesc',
      valueType: 'textarea',
      search: false,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      valueType: 'dateTime',
      search: false,
      width: 180,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedTime',
      valueType: 'dateTime',
      search: false,
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 150,
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
          title="确定要删除该机构吗？"
          onConfirm={() => handleDelete(record)}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<DeptItem>
        headerTitle="部门管理"
        rowKey="deptId"
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
            <PlusOutlined /> 新建部门
          </Button>,
          selectedRows.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title={`确定要删除选中的 ${selectedRows.length} 个机构吗？`}
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
        request={async () => {
          const res = await listDeptTree();
          if (res.code === 0 && res.data) {
            return {
              data: res.data,
              success: true,
            };
          }
          return {
            data: [],
            success: false,
          };
        }}
        pagination={false}
        defaultExpandAllRows
        childrenColumnName="children"
      />

      <Modal
        title="机构详情"
        open={detailModalOpen}
        footer={null}
        confirmLoading={detailLoading}
        onCancel={() => {
          setDetailModalOpen(false);
          setDetailRow(null);
        }}
      >
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="机构名称">
            {detailRow?.deptName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="机构编码">
            {detailRow?.deptCode || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="机构描述">
            {detailRow?.deptDesc || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="上级机构ID">
            {detailRow?.parentDeptId || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="顺序编号">
            {detailRow?.sortNo ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {detailRow?.createdTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {detailRow?.updatedTime || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>

      <ModalForm<DeptForm>
        title="新建部门"
        open={createModalOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setCreateModalOpen(false),
        }}
        onFinish={async (values) => {
          return handleSubmit(values, false);
        }}
        initialValues={{
          sortNo: 0,
        }}
      >
        <ProFormText
          name="deptName"
          label="机构名称"
          rules={[{ required: true, message: '请输入机构名称' }]}
        />
        <ProFormText name="deptCode" label="机构编码" />
        <ProFormDigit
          name="sortNo"
          label="顺序编号"
          rules={[{ required: true, message: '请输入顺序编号' }]}
          fieldProps={{
            min: 0,
            precision: 0,
          }}
        />
        <ProFormTextArea name="deptDesc" label="机构描述" />
        <ProFormTreeSelect
          name="parentDeptId"
          label="上级机构"
          placeholder="请选择上级机构"
          fieldProps={{
            treeData: convertTreeToOptions(treeData),
            allowClear: true,
            treeDefaultExpandAll: true,
          }}
        />
      </ModalForm>

      <ModalForm<DeptForm>
        title="编辑部门"
        open={editModalOpen}
        initialValues={{
          deptName: currentRow?.deptName,
          deptCode: currentRow?.deptCode,
          deptDesc: currentRow?.deptDesc,
          parentDeptId: currentRow?.parentDeptId,
          sortNo: currentRow?.sortNo ?? 0,
        }}
        modalProps={{
          destroyOnClose: true,
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
          name="deptName"
          label="机构名称"
          rules={[{ required: true, message: '请输入机构名称' }]}
        />
        <ProFormText name="deptCode" label="机构编码" />
        <ProFormDigit
          name="sortNo"
          label="顺序编号"
          rules={[{ required: true, message: '请输入顺序编号' }]}
          fieldProps={{
            min: 0,
            precision: 0,
          }}
        />
        <ProFormTextArea name="deptDesc" label="机构描述" />
        <ProFormTreeSelect
          name="parentDeptId"
          label="上级机构"
          placeholder="请选择上级机构"
          fieldProps={{
            treeData: convertTreeToOptions(
              treeData.filter((item) => item.deptId !== currentRow?.deptId),
            ),
            allowClear: true,
            treeDefaultExpandAll: true,
          }}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default Dept;
