import { ModalForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { createUser, UserForm } from "@/services/user";
import { App, Button, Form, Upload } from "antd";
import { Avatar } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import ImgCrop from "antd-img-crop";
import { uploadAttach } from "@/services/attach";
import DeptTreeSelect from "@/components/DeptTreeSelect";
import RoleSelect from "@/components/RoleSelect";

export type UserCreateModalProps = {
    open: boolean;
    onCancel: () => void;
    onSubmit: () => void;
};

const UserCreateModal: React.FC<UserCreateModalProps> = ({ open, onCancel, onSubmit }) => {
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
    const [createForm] = Form.useForm<UserForm>();
    const { message } = App.useApp();

    const handleSubmit = async (values: UserForm) => {
      const hide = message.loading('正在新增用户');
      try {
        const res = await createUser(values);
        if (res.code !== 0 || !res.data) {
          throw new Error(res.msg || '新增用户失败');
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
        createForm.setFieldsValue({
          avatarAttachId: attachId,
        } as any);
        // 使用同源下载地址作为预览，确保能正确展示
        setAvatarUrl(`/api/attach/download/${attachId}?token=${localStorage.getItem('jk-token')}`);
        message.success('头像上传成功');
      } catch (e) {
        message.error('上传头像失败，请稍后重试');
      }
    };

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
        <DeptTreeSelect />
        <RoleSelect />
      </ModalForm>

    );

};

export default UserCreateModal;