import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { App, Avatar, Form, Input, Modal, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUserDetail, updateUser, UserDetail, type UserForm } from '@/services/user';
import { uploadAttach } from '@/services/attach';
import { AttachOption } from '@/services/attach';

export type PersonalSettingsModalProps = {
  open: boolean;
  onCancel: () => void;
  currentUser?: API.CurrentUser | null;
  onSuccess?: () => void;
};

const getAvatarUrl = (attachId: string | number) =>
  `/api/attach/download/${attachId}`;

/** 从多种格式解析头像展示 URL（含 mock 的 avatarUrl） */
const getDisplayAvatarUrl = (
  user:
    | UserDetail
    | undefined,
) => {
  if (!user) return undefined;
  return user.avatar?.attachId != null ? getAvatarUrl(user.avatar.attachId) : undefined;
};

const PersonalSettingsModal: React.FC<PersonalSettingsModalProps> = ({
  open,
  onCancel,
  currentUser,
  onSuccess,
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<{ gender?: string; email?: string; avatarAttachId?: string }>();
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | undefined>();

  const userId = currentUser?.userId != null ? String(currentUser.userId) : '';

  // 打开时加载用户详情
  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      setDetail(null);
      setAvatarPreviewUrl(undefined);
      getUserDetail(userId)
        .then((res) => {
          if (res.code === 0 && res.data) {
            const d = res.data as UserDetail;
            setDetail(d);
            form.setFieldsValue({
              gender: d.gender,
              email: d.email,
              avatarAttachId: d.avatar && typeof d.avatar === 'object' && 'attachId' in d.avatar
                ? String((d.avatar as { attachId?: string }).attachId ?? '')
                : undefined,
            });
            const url = getDisplayAvatarUrl(d as any);
            setAvatarPreviewUrl(url);
          }
        })
        .catch(() => {
          message.error('加载用户信息失败');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setDetail(null);
      form.resetFields();
      setAvatarPreviewUrl(undefined);
    }
  }, [open, userId, form, message]);

  const handleAvatarUpload = async (file: File) => {
    try {
      const res = await uploadAttach(file);
      if (res.code !== 0 || !res.data) {
        message.error(res.msg || '上传头像失败，请稍后重试');
        return false;
      }
      const attach = res.data;
      const attachId = attach.attachId?.toString?.() ?? attach.attachId;
      form.setFieldsValue({ avatarAttachId: attachId });
      setAvatarPreviewUrl(getAvatarUrl(attach.attachId));
      message.success('头像上传成功');
    } catch {
      message.error('上传头像失败，请稍后重试');
    }
    return false;
  };

  const handleSubmit = async () => {
    if (!userId || !detail) return;
    const values = await form.validateFields().catch(() => null);
    if (!values) return;

    setSaving(true);
    try {
      const avatarAttachId =
        values.avatarAttachId ??
        (detail.avatar && typeof detail.avatar === 'object' && 'attachId' in detail.avatar
          ? String((detail.avatar as { attachId?: string }).attachId ?? '')
          : undefined);
      const payload: UserForm = {
        userName: detail.userName ?? '',
        account: detail.account ?? '',
        gender: values.gender,
        email: values.email,
        phone: detail.phone,
        ...(avatarAttachId ? { avatarAttachId } : {}),
        deptIds: detail.depts?.map((d) => d.deptId ?? '').filter(Boolean) ?? [],
        roleIds:
          detail.roles?.map((r) =>
            r.roleId != null ? String(r.roleId) : (r.roleName ?? ''),
          ).filter(Boolean) ?? [],
      };
      await updateUser(userId, payload);
      message.success('保存成功');
      onSuccess?.();
      onCancel();
    } catch (e: any) {
      message.error(e?.msg || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const deptNames = detail?.depts?.map((d) => d.deptName).filter(Boolean) ?? [];
  const roleNames = detail?.roles?.map((r) => r.roleName).filter(Boolean) ?? [];
  const displayAvatarUrl = avatarPreviewUrl ?? (detail ? getDisplayAvatarUrl(detail as any) : undefined);

  return (
    <Modal
      title="个人设置"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={saving}
      destroyOnClose
      width={520}
      okText="保存"
    >
      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center' }}>加载中...</div>
      ) : (
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item name="avatarAttachId" hidden>
            <input type="hidden" />
          </Form.Item>

          <Form.Item label="头像">
            <Upload
              showUploadList={false}
              beforeUpload={(file) => handleAvatarUpload(file as File)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {displayAvatarUrl ? (
                  <img
                    src={displayAvatarUrl}
                    alt="头像"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Avatar size={64} icon={<UserOutlined />} />
                )}
                <span style={{ color: '#666' }}>
                  <UploadOutlined /> 点击更换头像
                </span>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item label="用户姓名">
            <Input value={detail?.userName} disabled placeholder="用户姓名" />
          </Form.Item>

          <Form.Item label="账号">
            <Input value={detail?.account} disabled placeholder="账号" />
          </Form.Item>

          <Form.Item name="gender" label="性别">
            <Select
              placeholder="请选择性别"
              allowClear
              options={[
                { label: '男', value: '男' },
                { label: '女', value: '女' },
              ]}
            />
          </Form.Item>

          <Form.Item label="手机号码">
            <Input value={detail?.phone} disabled placeholder="手机号码" />
          </Form.Item>

          <Form.Item name="email" label="电子邮箱">
            <Input placeholder="请输入电子邮箱" />
          </Form.Item>

          <Form.Item label="所属部门">
            <Input
              value={deptNames.join('、') || '-'}
              disabled
              placeholder="所属部门"
            />
          </Form.Item>

          <Form.Item label="角色">
            <Input
              value={roleNames.join('、') || '-'}
              disabled
              placeholder="角色"
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default PersonalSettingsModal;
