import { Descriptions, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { App } from 'antd';
import { getDeptDetail, type DeptItem } from '@/services/dept';

export type DeptDetailModalProps = {
  deptId: string;
  open: boolean;
  onClose: () => void;
};

const DeptDetailModal: React.FC<DeptDetailModalProps> = ({ deptId, open, onClose }) => {
  const [data, setData] = useState<DeptItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { message } = App.useApp();

  useEffect(() => {
    const loadDetail = async () => {
      if (!deptId) return;
      setLoading(true);
      try {
        const res = await getDeptDetail(deptId);
        if (res.code === 0 && res.data) {
          setData(res.data);
        } else {
          message.error(res.msg || '加载机构详情失败');
        }
      } catch (e) {
        message.error('加载机构详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [deptId]);

  return (
    <Modal
      title="机构详情"
      open={open}
      footer={null}
      confirmLoading={loading}
      onCancel={onClose}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="机构名称">
          {data?.deptName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="机构编码">
          {data?.deptCode || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="机构描述">
          {data?.deptDesc || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="顺序编号">
          {data?.sortNo ?? '-'}
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

export default DeptDetailModal;
