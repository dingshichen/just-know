import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { DeptItem } from '@/services/dept';
import {
  batchDeleteDepts,
  deleteDept,
  listDeptTree,
} from '@/services/dept';
import DeptDetailModal from './detail';
import DeptCreateModal from './create';
import DeptEditModal from './edit';

const Dept: React.FC = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | undefined>();
  const [selectedRows, setSelectedRows] = useState<DeptItem[]>([]);
  const [treeData, setTreeData] = useState<DeptItem[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { message } = App.useApp();

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

  const handleShowDetail = (deptId: string) => {
    setCurrentId(deptId);
    setDetailModalOpen(true);
  };

  const handleShowEdit = (deptId: string) => {
    setCurrentId(deptId);
    setEditModalOpen(true);
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
          onClick={() => handleShowDetail(record.deptId)}
        >
          详情
        </a>,
        <a
          key="edit"
          onClick={() => handleShowEdit(record.deptId)}
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
        headerTitle="机构管理"
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
              setCurrentId(undefined);
              setCreateModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建机构
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

      <DeptCreateModal
        open={createModalOpen}
        treeData={treeData}
        onCancel={() => {
          setCreateModalOpen(false);
        }}
        onSubmit={() => {
          setCreateModalOpen(false);
          loadTreeData();
          actionRef.current?.reload();
        }}
      />

      {currentId && (
        <DeptDetailModal
          deptId={currentId}
          open={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
          }}
        />
      )}

      {currentId && (
        <DeptEditModal
          deptId={currentId}
          open={editModalOpen}
          treeData={treeData}
          onCancel={() => {
            setEditModalOpen(false);
            setCurrentId(undefined);
          }}
          onSubmit={() => {
            setEditModalOpen(false);
            setCurrentId(undefined);
            loadTreeData();
            actionRef.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};

export default Dept;
