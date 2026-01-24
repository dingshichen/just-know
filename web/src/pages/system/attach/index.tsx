import {
  DownOutlined,
  FileOutlined,
  InboxOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Dropdown,
  Input,
  List,
  Modal,
  Row,
  Select,
  Upload,
  message,
} from 'antd';
import type { UploadProps } from 'antd';
import dayjs from 'dayjs';
import type { FC } from 'react';
import React, { useState } from 'react';
import type { AttachItem } from '@/services/ant-design-pro/attach';
import {
  batchDeleteAttaches,
  deleteAttach,
  downloadAttachFile,
  getAttachStats,
  pageAttaches,
  uploadAttach,
} from '@/services/ant-design-pro/attach';
import useStyles from './style.style';

const { Search } = Input;
const { Dragger } = Upload;

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => {
  const { styles } = useStyles();
  return (
    <div className={styles.headerInfo}>
      <span>{title}</span>
      <p>{value}</p>
      {bordered && <em />}
    </div>
  );
};

const ListContent: FC<{ data: AttachItem }> = ({ data }) => {
  const { styles } = useStyles();
  return (
    <div>
      <div className={styles.listContentItem}>
        <span>存储类型</span>
        <p>{data.storageType || '-'}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>上传时间</span>
        <p>{data.createdTime ? dayjs(data.createdTime).format('YYYY-MM-DD HH:mm') : '-'}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>大小</span>
        <p>{(data.attachSize ?? 0)} KB</p>
      </div>
    </div>
  );
};

type UploadModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const UploadModal: FC<UploadModalProps> = ({ open, onClose, onSuccess }) => {
  const { styles } = useStyles();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await uploadAttach(file);
      if (res?.code === 0) {
        message.success(`"${file.name}" 上传成功`);
        onSuccess();
      } else {
        message.error(res?.msg || '上传失败');
      }
    } catch (e) {
      message.error('上传失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    disabled: uploading,
    customRequest: async ({ file }) => {
      await handleUpload(file as File);
    },
  };

  if (!open) return null;

  return (
    <Modal
      title="上传附件"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
      className={styles.uploadModal}
      destroyOnHidden
    >
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">支持多选</p>
      </Dragger>
    </Modal>
  );
};

const AttachList: FC = () => {
  const { styles } = useStyles();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [title, setTitle] = useState<string>('');
  const [storageType, setStorageType] = useState<string>('all');
  const [attachType, setAttachType] = useState<string>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { data: stats, mutate: statsMutate } = useRequest(getAttachStats);

  const {
    data: pageData,
    loading,
    mutate,
  } = useRequest(
    () =>
      pageAttaches({
        pageNum: page,
        pageSize,
        title: title || undefined,
        storageType: storageType === 'all' ? undefined : storageType,
        attachType: attachType === 'all' ? undefined : attachType,
      }),
    {
      refreshDeps: [page, pageSize, title, storageType, attachType],
    },
  );

  const list = pageData?.list ?? [];
  const total = pageData?.total ?? 0;
  const refreshListAndStats = () => {
    mutate();
    statsMutate();
  };

  const handleDownload = async (item: AttachItem) => {
    try {
      await downloadAttachFile(item.attachId!, item.title || 'download');
    } catch (e) {
      message.error('下载失败，请稍后重试');
    }
  };

  const handleDelete = (item: AttachItem) => {
    Modal.confirm({
      title: '删除附件',
      content: `确定删除「${item.title}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteAttach(item.attachId!);
          message.success('删除成功');
          refreshListAndStats();
        } catch (e) {
          message.error('删除失败，请稍后重试');
        }
      },
    });
  };

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的附件');
      return;
    }
    Modal.confirm({
      title: '批量删除',
      content: `确定删除选中的 ${selectedRowKeys.length} 个附件吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await batchDeleteAttaches(selectedRowKeys as number[]);
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          refreshListAndStats();
        } catch (e) {
          message.error('批量删除失败，请稍后重试');
        }
      },
    });
  };

  const MoreBtn: FC<{ item: AttachItem }> = ({ item }) => (
    <Dropdown
      menu={{
        onClick: ({ key }) => {
          if (key === 'delete') handleDelete(item);
        },
        items: [{ key: 'delete', label: '删除', danger: true }],
      }}
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  const paginationProps = {
    current: page,
    pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: true,
    onChange: (p: number, size?: number) => {
      setPage(p);
      setPageSize(size || 10);
    },
  };

  const extraContent = (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setUploadModalOpen(true)}>
        上传
      </Button>
      <Select
        value={storageType}
        onChange={(v) => {
          setStorageType(v);
          setPage(1);
        }}
        style={{ width: 120 }}
        options={[
          { label: '全部存储', value: 'all' },
          { label: '本地', value: 'LOCAL' },
        ]}
      />
      <Select
        value={attachType}
        onChange={(v) => {
          setAttachType(v);
          setPage(1);
        }}
        style={{ width: 120 }}
        options={[
          { label: '全部类型', value: 'all' },
          { label: '.pdf', value: '.pdf' },
          { label: '.png', value: '.png' },
          { label: '.jpg', value: '.jpg' },
          { label: '.doc', value: '.doc' },
          { label: '.txt', value: '.txt' },
        ]}
      />
      <Search
        className={styles.extraContentSearch}
        placeholder="按标题搜索"
        allowClear
        onSearch={(v) => {
          setTitle(v);
          setPage(1);
        }}
        variant="filled"
      />
    </div>
  );

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>
          <Card variant="borderless">
            <Row gutter={[16, 16]} wrap={false}>
              <Col flex="1">
                <Info
                  title="附件总数"
                  value={`${stats?.total ?? 0} 个`}
                  bordered
                />
              </Col>
              <Col flex="1">
                <Info
                  title="今日上传"
                  value={`${stats?.todayCount ?? 0} 个`}
                  bordered
                />
              </Col>
              <Col flex="1">
                <Info title="本周上传" value={`${stats?.weekCount ?? 0} 个`} bordered />
              </Col>
              <Col flex="1">
                <Info
                  title="本月上传"
                  value={`${stats?.monthCount ?? 0} 个`}
                  bordered
                />
              </Col>
              <Col flex="1">
                <Info title="本年度上传" value={`${stats?.yearCount ?? 0} 个`} />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            variant="borderless"
            title="附件列表"
            style={{ marginTop: 24 }}
            styles={{ body: { padding: '0 32px 40px 32px' } }}
            extra={extraContent}
          >
            {selectedRowKeys.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <Button danger onClick={handleBatchDelete}>
                  批量删除 ({selectedRowKeys.length})
                </Button>
              </div>
            )}
            <List
              size="large"
              rowKey="attachId"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  key={item.attachId}
                  actions={[
                    <a
                      key="download"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(item);
                      }}
                    >
                      下载
                    </a>,
                    <MoreBtn key="more" item={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Checkbox
                          checked={selectedRowKeys.includes(item.attachId!)}
                          onChange={(e) => {
                            e.stopPropagation();
                            if (e.target.checked)
                              setSelectedRowKeys([...selectedRowKeys, item.attachId!]);
                            else
                              setSelectedRowKeys(selectedRowKeys.filter((k) => k !== item.attachId));
                          }}
                        />
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 4,
                            background: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <FileOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                        </div>
                      </div>
                    }
                    title={
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          handleDownload(item);
                        }}
                      >
                        {item.title}
                      </a>
                    }
                    description={`${item.attachType || '-'} · ${(item.attachSize ?? 0)} KB`}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageContainer>

      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={refreshListAndStats}
      />
    </div>
  );
};

export default AttachList;
