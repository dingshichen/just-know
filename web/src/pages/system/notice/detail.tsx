import { Descriptions, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { App } from 'antd';
import { getNoticeDetail, type NoticeDetail } from '@/services/notice';

export type NoticeDetailModalProps = {
  noticeId: string;
  open: boolean;
  onClose: () => void;
};

const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({ noticeId, open, onClose }) => {
  const [data, setData] = useState<NoticeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { message } = App.useApp();

  useEffect(() => {
    const loadDetail = async () => {
      if (!noticeId) return;
      setLoading(true);
      try {
        const res = await getNoticeDetail(noticeId);
        if (res.code === 0 && res.data) {
          setData({
            ...res.data,
            noticeId: res.data.noticeId?.toString?.() ?? String(res.data.noticeId),
          } as NoticeDetail);
        } else {
          message.error(res.msg || '加载公告详情失败');
        }
      } catch (e) {
        message.error('加载公告详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [noticeId]);

  return (
    <Modal
      title="公告详情"
      open={open}
      footer={null}
      confirmLoading={loading}
      onCancel={onClose}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="标题">
          {data?.title || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="内容">
          {data?.content || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          {data?.noticeStatus === 'PUBLISHED' ? (
            <Tag color="green">已发布</Tag>
          ) : data?.noticeStatus === 'DRAFT' ? (
            <Tag>草稿</Tag>
          ) : (
            '-'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="开始日期">
          {data?.startDate || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="结束日期">
          {data?.endDate || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {data?.createdTime || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">
          {data?.updatedTime || '-'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default NoticeDetailModal;
