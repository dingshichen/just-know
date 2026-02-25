import { Descriptions, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { getRoleDetail, type RoleDetail } from '@/services/role';
import { App } from 'antd';

export type RoleDetailModalProps = {
  roleId: string;
  open: boolean;
  onClose: () => void;
};

const RoleDetailModal: React.FC<RoleDetailModalProps> = ({ roleId, open, onClose }) => {
  const [data, setData] = useState<RoleDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { message } = App.useApp();

  useEffect(() => {
    const loadDetail = async () => {
      if (!roleId) return;
      setLoading(true);
      try {
        const res = await getRoleDetail(roleId);
        if (res.code === 0 && res.data) {
          setData(res.data);
        } else {
          message.error(res.msg || '加载角色详情失败');
        }
      } catch (e) {
        message.error('加载角色详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [roleId]);

  return (
    <Modal
      title="角色详情"
      open={open}
      footer={null}
      confirmLoading={loading}
      onCancel={onClose}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="角色名称">
          {data?.roleName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="角色编码">
          {data?.roleCode || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="角色描述">
          {data?.roleDesc || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="创建用户">
          {data?.createdUser?.userName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="更新用户">
          {data?.updatedUser?.userName || '-'}
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

export default RoleDetailModal;
