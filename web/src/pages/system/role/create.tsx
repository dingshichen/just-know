import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { App } from 'antd';
import React from 'react';
import { createRole, type RoleForm } from '@/services/role';

export type RoleCreateModalProps = {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

const RoleCreateModal: React.FC<RoleCreateModalProps> = ({ open, onCancel, onSubmit }) => {
  const { message } = App.useApp();

  const handleSubmit = async (values: RoleForm) => {
    const hide = message.loading('正在新增角色');
    try {
      await createRole(values);
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
    <ModalForm<RoleForm>
      title="新建角色"
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
        name="roleName"
        label="角色名称"
        rules={[{ required: true, message: '请输入角色名称' }]}
      />
      <ProFormText
        name="roleCode"
        label="角色编码"
        rules={[{ required: true, message: '请输入角色编码' }]}
      />
      <ProFormTextArea name="roleDesc" label="角色描述" />
    </ModalForm>
  );
};

export default RoleCreateModal;
