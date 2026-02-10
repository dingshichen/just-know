import { Descriptions, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { App } from 'antd';
import { getPermissionDetail, type PermissionItem } from '@/services/permission';

export type PermissionDetailModalProps = {
  permissionId: string;
  open: boolean;
  onClose: () => void;
};

const PermissionDetailModal: React.FC<PermissionDetailModalProps> = ({ permissionId, open, onClose }) => {
  const [data, setData] = useState<PermissionItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { message } = App.useApp();

  useEffect(() => {
    const loadDetail = async () => {
      if (!permissionId) return;
      setLoading(true);
      try {
        const res = await getPermissionDetail(permissionId);
        if (res.code === 0 && res.data) {
          setData(res.data);
        } else {
          message.error(res.msg || '加载权限详情失败');
        }
      } catch (e) {
        message.error('加载权限详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [permissionId]);

  return (
    <Modal
      title="权限详情"
      open={open}
      footer={null}
      confirmLoading={loading}
      onCancel={onClose}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="权限名称">
          {data?.permissionName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="权限编码">
          {data?.permissionCode || '-'}
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

export default PermissionDetailModal;
