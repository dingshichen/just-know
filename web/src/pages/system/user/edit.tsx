import { ModalForm, ProFormSelect, ProFormText, ProFormTreeSelect } from "@ant-design/pro-components";
import { getUserDetail, UserDetail, UserForm } from "@/services/ant-design-pro/user";
import { Form, Upload } from "antd";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { listAllRoles, RoleItem, RoleOption } from "@/services/ant-design-pro/role";
import { useEffect, useState } from "react";
import { DataNode } from "antd/es/tree";
import { DeptOption } from "@/services/ant-design-pro/dept";

export type UserEditModalProps = {
    userId: string;
    open: boolean;
    onCancel: () => void;
    handleSubmit: (values: UserForm) => Promise<boolean>;
    handleAvatarUpload: (file: File, form: any, setPreview: (url: string | undefined) => void) => Promise<boolean>;
    deptTree: DataNode[];
};

const UserEditModal: React.FC<UserEditModalProps> = ({ userId, open, onCancel, handleSubmit, handleAvatarUpload, deptTree }) => {
    const [data, setData] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [editForm] = Form.useForm<UserForm>();
    const [editAvatarPreviewUrl, setEditAvatarPreviewUrl] = useState<string | undefined>(undefined);
    useEffect(() => {
        const loadDetail = async () => {
            const res = await getUserDetail(userId);
            if (res.code === 0 && res.data) {
                setData(res.data);
                setLoading(false);
            }
        }
        loadDetail();
    }, [userId]);
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
        <Form.Item label="头像">
          <Upload
            showUploadList={false}
            beforeUpload={(file) =>
              handleAvatarUpload(file as any, editForm, setEditAvatarPreviewUrl)
            }
          >
            <Avatar
              src={editAvatarPreviewUrl}
              size={64}
              icon={<UserOutlined />}
            />
          </Upload>
        </Form.Item>
        <ProFormText
          name="userName"
          label="用户姓名"
          initialValue={data?.userName}
          rules={[{ required: true, message: '请输入用户姓名' }]}
        />
        <ProFormText
          name="account"
          label="账号"
          initialValue={data?.account}
          rules={[{ required: true, message: '请输入账号' }]}
        />
        <ProFormSelect
          name="gender"
          label="性别"
          valueEnum={{
            男: '男',
            女: '女',
          }}
          initialValue={data?.gender}
        />
        <ProFormText name="phone" label="手机号码" initialValue={data?.phone} />
        <ProFormText name="email" label="电子邮箱" initialValue={data?.email} />
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
          initialValue={data?.depts?.map((dept: DeptOption) => dept.deptId)}
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
          initialValue={data?.roles?.map((role: RoleOption) => role.roleId)}
        />
      </ModalForm>
    );
}

export default UserEditModal;