import { ModalForm, ProFormSelect, ProFormText, ProFormTreeSelect } from "@ant-design/pro-components";
import { UserForm } from "@/services/ant-design-pro/user";
import { Form, Upload } from "antd";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { listAllRoles, RoleItem } from "@/services/ant-design-pro/role";
import { useState } from "react";
import { DataNode } from "antd/es/tree";

export type UserCreateModalProps = {
    open: boolean;
    onCancel: () => void;
    handleSubmit: (values: UserForm) => Promise<boolean>;
    handleAvatarUpload: (file: File, form: any, setPreview: (url: string | undefined) => void) => Promise<boolean>;
    deptTree: DataNode[];
};

const UserCreateModal: React.FC<UserCreateModalProps> = ({ open, onCancel, handleSubmit, handleAvatarUpload, deptTree }) => {
    const [createAvatarPreviewUrl, setCreateAvatarPreviewUrl] = useState<string | undefined>(undefined);
    const [createForm] = Form.useForm<UserForm>();
    return (
        <ModalForm<UserForm>
        title="新建用户"
        open={open}
        modalProps={{
          destroyOnHidden: true,
          onCancel: onCancel,
        }}
        form={createForm}
        onFinish={async (values) => {
          return handleSubmit(values);
        }}
      >
        <Form.Item name="avatarAttachId" hidden>
          <input type="hidden" />
        </Form.Item>
        <Form.Item label="头像">
          <Upload
            showUploadList={false}
            beforeUpload={(file) =>
              handleAvatarUpload(file as any, createForm, setCreateAvatarPreviewUrl)
            }
          >
            <Avatar
              src={createAvatarPreviewUrl}
              size={64}
              icon={<UserOutlined />}
            />
          </Upload>
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

};

export default UserCreateModal;