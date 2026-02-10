import { ModalForm, ProFormSelect, ProFormText, ProFormTreeSelect } from "@ant-design/pro-components";
import { getUserDetail, updateUser, UserForm } from "@/services/user";
import { App, Avatar, Button, Form, Space, Upload } from "antd";
import { listAllRoles, RoleItem, RoleOption } from "@/services/role";
import { useEffect, useState } from "react";
import ImgCrop from 'antd-img-crop';
import { UploadOutlined } from "@ant-design/icons";
import { DataNode } from "antd/es/tree";
import { DeptOption } from "@/services/dept";
import { uploadAttach } from "@/services/attach";

export type UserEditModalProps = {
    userId: string;
    open: boolean;
    onCancel: () => void;
    onSubmit: () => void;
    deptTree: DataNode[];
};

const UserEditModal: React.FC<UserEditModalProps> = ({ userId, open, onCancel, onSubmit, deptTree }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [editForm] = Form.useForm<UserForm>();
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
    const { message } = App.useApp();
    
    useEffect(() => {
        const loadDetail = async () => {
            const res = await getUserDetail(userId);
            if (res.code === 0 && res.data) {
                const detail = res.data;
                editForm.setFieldsValue({
                    userName: detail.userName,
                    account: detail.account,
                    gender: detail.gender,
                    phone: detail.phone,
                    email: detail.email,
                    deptIds: detail.depts?.map((dept: DeptOption) => dept.deptId),
                    roleIds: detail.roles?.map((role: RoleOption) => role.roleId),
                    avatarAttachId: detail.avatar?.attachId,
                });
                if (detail.avatar?.attachId) {
                    setAvatarUrl(`/api/attach/download/${detail.avatar.attachId}?token=${localStorage.getItem('jk-token')}`);
                }
                setLoading(false);
            }
        }
        loadDetail();
    }, [userId]);

    const handleAvatarUpload = async (
      options: any,
    ) => {
      try {
        const res = await uploadAttach(options.file as any);
        if (res.code !== 0) {
          message.error(res.msg || '上传头像失败，请稍后重试');
          return;
        }
        const attach = res.data;
        const attachId = attach.attachId;
        // 保存附件ID到表单（隐藏项会随表单提交）
        editForm.setFieldsValue({
          avatarAttachId: attachId,
        } as any);
        // 使用同源下载地址作为预览，确保能正确展示
        setAvatarUrl(`/api/attach/download/${attachId}?token=${localStorage.getItem('jk-token')}`);
        message.success('头像上传成功');
      } catch (e) {
        message.error('上传头像失败，请稍后重试');
      }
    };

    const handleSubmit = async (values: UserForm) => {
      if (!userId) {
        message.error('用户ID不存在');
        return;
      }
      const hide = message.loading('正在保存用户信息');
      try {
        await updateUser(userId, values);
        hide();
        message.success('保存成功');
        onSubmit();
      } catch (e) {
        hide();
        message.error('保存失败，请稍后重试');
      }
    };

    return (
    <ModalForm<UserForm>
        title="编辑用户"
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
        <Form.Item name="avatarAttachId" hidden>
          <input type="hidden" />
        </Form.Item>
        <Form.Item>
          {avatarUrl && (
            <Avatar src={avatarUrl} size={100} style={{ marginRight: 10 }} />
          )}
          <ImgCrop cropShape="round">
            <Upload
              showUploadList={false}
              customRequest={(options) => handleAvatarUpload(options)}
            >
              <Button icon={<UploadOutlined />}>上传头像</Button>
            </Upload>
          </ImgCrop>
        </Form.Item>
        <ProFormText
          name="userName"
          label="用户姓名"
          rules={[{ required: true, message: '请输入用户姓名' }]}
        />
        <ProFormText
          name="account"
          label="账号"
          rules={[{ required: true, message: '请输入账号' }]}
        />
        <ProFormSelect
          name="gender"
          label="性别"
          valueEnum={{
            男: '男',
            女: '女',
          }}
        />
        <ProFormText name="phone" label="手机号码" />
        <ProFormText name="email" label="电子邮箱" />
        <ProFormTreeSelect
          name="deptIds"
          label="部门"
          placeholder="请选择部门"
          fieldProps={{
            multiple: true,
            treeData: deptTree,
            treeCheckable: true,
            showCheckedStrategy: 'SHOW_ALL',
            allowClear: true,
          }}
        />
        <ProFormSelect
          name="roleIds"
          label="角色"
          placeholder="请选择角色"
          fieldProps={{
            mode: 'multiple',
          }}
          request={async () => {
            try {
              const res = await listAllRoles();
              if (res.code !== 0) {
                return [];
              }
              return res.data.map((role: RoleItem) => ({
                label: role.roleName,
                value: role.roleId,
              }));
            } catch {
              return [];
            }
          }}
        />
      </ModalForm>
    );
}

export default UserEditModal;