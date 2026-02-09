import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { App, Button, Descriptions, Modal, Popconfirm, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import type {
  NoticeDetail,
  NoticeForm,
  NoticeItem,
  NoticePageParams,
} from '@/services/notice';
import {
  batchDeleteNotices,
  createNotice,
  deleteNotice,
  getNoticeDetail,
  pageNotices,
  publishNotice,
  updateNotice,
} from '@/services/notice';

const NoticePage: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const { message } = App.useApp();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<NoticeItem | undefined>();
  const [selectedRows, setSelectedRows] = useState<NoticeItem[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailRow, setDetailRow] = useState<NoticeDetail | null>(null);

  const handleSubmit = async (values: NoticeForm, isEdit: boolean) => {
    const hide = message.loading(isEdit ? '正在保存公告信息' : '正在新增公告');
    try {
      if (isEdit && currentRow?.noticeId) {
        await updateNotice(currentRow.noticeId, values);
      } else {
        const res = await createNotice(values);
        if (res.code !== 0 || res.data == null) {
          throw new Error(res.msg || '新增公告失败');
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

  const handleShowDetail = async (row: NoticeItem) => {
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const res = await getNoticeDetail(row.noticeId);
      if (res.code === 0 && res.data) {
        const data = res.data;
        setDetailRow({
          ...data,
          noticeId: data.noticeId?.toString?.() ?? String(data.noticeId),
        } as NoticeDetail);
      } else {
        message.error(res.msg || '加载公告详情失败');
      }
    } catch (e) {
      message.error('加载公告详情失败，请稍后重试');
    } finally {
      setDetailLoading(false);
    }
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
              setCurrentRow(undefined);
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

      <Modal
        title="公告详情"
        open={detailModalOpen}
        footer={null}
        onCancel={() => {
          setDetailModalOpen(false);
          setDetailRow(null);
        }}
      >
        <Descriptions column={1} bordered size="small" loading={detailLoading}>
          <Descriptions.Item label="标题">
            {detailRow?.title || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="内容">
            {detailRow?.content || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {detailRow?.noticeStatus === 'PUBLISHED' ? (
              <Tag color="green">已发布</Tag>
            ) : detailRow?.noticeStatus === 'DRAFT' ? (
              <Tag>草稿</Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="开始日期">
            {detailRow?.startDate || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="结束日期">
            {detailRow?.endDate || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {detailRow?.createdTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {detailRow?.updatedTime || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>

      <ModalForm<NoticeForm>
        title="新建公告"
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
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        />
        <ProFormTextArea name="content" label="内容" />
        <ProFormSelect
          name="noticeStatus"
          label="状态"
          valueEnum={{
            DRAFT: '草稿',
            PUBLISHED: '已发布',
          }}
          initialValue="DRAFT"
        />
        <ProFormDatePicker name="startDate" label="开始日期" />
        <ProFormDatePicker name="endDate" label="结束日期" />
      </ModalForm>

      <ModalForm<NoticeForm>
        title="编辑公告"
        open={editModalOpen}
        initialValues={{
          title: currentRow?.title,
          content: currentRow?.content,
          noticeStatus: currentRow?.noticeStatus,
          startDate: currentRow?.startDate,
          endDate: currentRow?.endDate,
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
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        />
        <ProFormTextArea name="content" label="内容" />
        <ProFormSelect
          name="noticeStatus"
          label="状态"
          valueEnum={{
            DRAFT: '草稿',
            PUBLISHED: '已发布',
          }}
        />
        <ProFormDatePicker name="startDate" label="开始日期" />
        <ProFormDatePicker name="endDate" label="结束日期" />
      </ModalForm>
    </PageContainer>
  );
};

export default NoticePage;
