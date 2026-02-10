import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { App } from 'antd';
import React from 'react';
import { createPermission, type PermissionForm } from '@/services/permission';

export type PermissionCreateModalProps = {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

const PermissionCreateModal: React.FC<PermissionCreateModalProps> = ({ open, onCancel, onSubmit }) => {
  const { message } = App.useApp();

  const handleSubmit = async (values: PermissionForm) => {
    const hide = message.loading('正在新增权限');
    try {
      const res = await createPermission(values);
      if (res.code !== 0 || res.data == null) {
        throw new Error(res.msg || '新增权限失败');
      }
      hide();
      message.success('新增成功');
      onSubmit();
      return true;
    } catch (e) {
      hide();
      message.error('新增失败，请稍后重试');
      return false;
    }
  };

  return (
    <ModalForm<PermissionForm>
      title="新建权限"
      open={open}
      modalProps={{
        destroyOnHidden: true,
        onCancel: onCancel,
      }}
      onFinish={async (values) => {
        return handleSubmit(values);
      }}
    >
      <ProFormText
        name="permissionName"
        label="权限名称"
        rules={[{ required: true, message: '请输入权限名称' }]}
      />
      <ProFormText
        name="permissionCode"
        label="权限编码"
        rules={[{ required: true, message: '请输入权限编码' }]}
      />
    </ModalForm>
  );
};

export default PermissionCreateModal;
