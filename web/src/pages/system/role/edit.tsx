import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { App } from 'antd';
import React, { useEffect, useState } from 'react';
import { getRoleDetail, updateRole, type RoleForm } from '@/services/role';
import { Form } from 'antd';

export type RoleEditModalProps = {
  roleId: string;
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

const RoleEditModal: React.FC<RoleEditModalProps> = ({ roleId, open, onCancel, onSubmit }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [editForm] = Form.useForm<RoleForm>();
  const { message } = App.useApp();

  useEffect(() => {
    const loadDetail = async () => {
      if (!roleId) return;
      setLoading(true);
      try {
        const res = await getRoleDetail(roleId);
        if (res.code === 0 && res.data) {
          editForm.setFieldsValue({
            roleName: res.data.roleName,
            roleCode: res.data.roleCode,
            roleDesc: res.data.roleDesc,
          });
        }
      } catch (e) {
        message.error('加载角色信息失败');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [roleId]);

  const handleSubmit = async (values: RoleForm) => {
    const hide = message.loading('正在保存角色信息');
    try {
      await updateRole(roleId, values);
      hide();
      message.success('保存成功');
      onSubmit();
      return true;
    } catch (e) {
      hide();
      message.error('保存失败，请稍后重试');
      return false;
    }
  };

  return (
    <ModalForm<RoleForm>
      title="编辑角色"
      open={open}
      form={editForm}
      loading={loading}
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

export default RoleEditModal;
