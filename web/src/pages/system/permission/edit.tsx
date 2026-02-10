import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { App, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { getPermissionDetail, updatePermission, type PermissionForm } from '@/services/permission';

export type PermissionEditModalProps = {
  permissionId: string;
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

const PermissionEditModal: React.FC<PermissionEditModalProps> = ({ permissionId, open, onCancel, onSubmit }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [editForm] = Form.useForm<PermissionForm>();
  const { message } = App.useApp();

  useEffect(() => {
    const loadDetail = async () => {
      if (!permissionId) return;
      setLoading(true);
      try {
        const res = await getPermissionDetail(permissionId);
        if (res.code === 0 && res.data) {
          editForm.setFieldsValue({
            permissionName: res.data.permissionName,
            permissionCode: res.data.permissionCode,
          });
        }
      } catch (e) {
        message.error('加载权限信息失败');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [permissionId]);

  const handleSubmit = async (values: PermissionForm) => {
    const hide = message.loading('正在保存权限信息');
    try {
      await updatePermission(permissionId, values);
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
    <ModalForm<PermissionForm>
      title="编辑权限"
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

export default PermissionEditModal;
