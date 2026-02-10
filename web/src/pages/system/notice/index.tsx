import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { App, Button, Modal, Popconfirm, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import type {
  NoticeItem,
  NoticePageParams,
} from '@/services/notice';
import {
  batchDeleteNotices,
  deleteNotice,
  pageNotices,
  publishNotice,
} from '@/services/notice';
import NoticeDetailModal from './detail';
import NoticeCreateModal from './create';
import NoticeEditModal from './edit';

const NoticePage: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const { message } = App.useApp();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | undefined>();
  const [selectedRows, setSelectedRows] = useState<NoticeItem[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleDelete = async (row: NoticeItem) => {
    const hide = message.loading('正在删除公告');
    try {
      const res = await deleteNotice(row.noticeId);
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
      message.warning('请先选择要删除的公告');
      return;
    }
    const hide = message.loading('正在批量删除公告');
    try {
      const res = await batchDeleteNotices(selectedRows.map((item) => item.noticeId));
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

  const handlePublish = async (row: NoticeItem) => {
    const hide = message.loading('正在发布公告');
    try {
      const res = await publishNotice(row.noticeId);
      hide();
      if (res.code !== 0) {
        message.error(res.msg || '发布失败，请稍后重试');
        return;
      }
      message.success('发布成功');
      actionRef.current?.reload();
    } catch (e) {
      hide();
      message.error('发布失败，请稍后重试');
    }
  };

  const handleShowDetail = (noticeId: string) => {
    setCurrentId(noticeId);
    setDetailModalOpen(true);
  };

  const handleShowEdit = (noticeId: string) => {
    setCurrentId(noticeId);
    setEditModalOpen(true);
  };

  const columns: ProColumns<NoticeItem>[] = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '状态',
      dataIndex: 'noticeStatus',
      valueType: 'select',
      valueEnum: {
        DRAFT: { text: '草稿', status: 'Default' },
        PUBLISHED: { text: '已发布', status: 'Success' },
      },
      render: (_, record) => {
        if (record.noticeStatus === 'PUBLISHED') {
          return <Tag color="green">已发布</Tag>;
        }
        if (record.noticeStatus === 'DRAFT') {
          return <Tag>草稿</Tag>;
        }
        return '-';
      },
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      valueType: 'date',
      search: false,
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      valueType: 'date',
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
          onClick={() => handleShowDetail(record.noticeId)}
        >
          详情
        </a>,
        <a
          key="edit"
          onClick={() => handleShowEdit(record.noticeId)}
        >
          编辑
        </a>,
        record.noticeStatus === 'DRAFT' && (
          <a
            key="publish"
            onClick={() => {
              Modal.confirm({
                title: '确定要发布该公告吗？',
                onOk: () => handlePublish(record),
              });
            }}
          >
            发布
          </a>
        ),
        <Popconfirm
          key="delete"
          title="确定要删除该公告吗？"
          onConfirm={() => handleDelete(record)}
        >
          <a>删除</a>
        </Popconfirm>,
      ].filter(Boolean),
    },
  ];

  return (
    <PageContainer>
      <ProTable<NoticeItem, NoticePageParams>
        headerTitle="系统公告"
        rowKey="noticeId"
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
            <PlusOutlined /> 新建公告
          </Button>,
          selectedRows.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title={`确定要删除选中的 ${selectedRows.length} 条公告吗？`}
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
          const res = await pageNotices({
            pageNum: current,
            pageSize,
            ...rest,
          });
          const list = (res.data?.list ?? []).map((item) => ({
            ...item,
            noticeId: item.noticeId?.toString?.() ?? String(item.noticeId),
          }));
          return {
            data: list,
            success: res.code === 0,
            total: res.data?.total ?? 0,
          };
        }}
        pagination={{
          pageSize: 10,
        }}
      />

      <NoticeCreateModal
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
        <NoticeDetailModal
          noticeId={currentId}
          open={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
          }}
        />
      )}

      {currentId && (
        <NoticeEditModal
          noticeId={currentId}
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

export default NoticePage;
