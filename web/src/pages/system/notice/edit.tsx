import {
  ModalForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { getNoticeDetail, updateNotice, type NoticeForm } from '@/services/notice';

export type NoticeEditModalProps = {
  noticeId: string;
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

const NoticeEditModal: React.FC<NoticeEditModalProps> = ({ noticeId, open, onCancel, onSubmit }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [editForm] = Form.useForm<NoticeForm>();
  const { message } = App.useApp();

  useEffect(() => {
    const loadDetail = async () => {
      if (!noticeId) return;
      setLoading(true);
      try {
        const res = await getNoticeDetail(noticeId);
        if (res.code === 0 && res.data) {
          editForm.setFieldsValue({
            title: res.data.title,
            content: res.data.content,
            noticeStatus: res.data.noticeStatus,
            startDate: res.data.startDate,
            endDate: res.data.endDate,
          });
        }
      } catch (e) {
        message.error('加载公告信息失败');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [noticeId]);

  const handleSubmit = async (values: NoticeForm) => {
    const hide = message.loading('正在保存公告信息');
    try {
      await updateNotice(noticeId, values);
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
    <ModalForm<NoticeForm>
      title="编辑公告"
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
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      />
      <ProFormTextArea name="content" label="内容" />
      <ProFormSelect
        name="noticeStatus"
        label="状态"
        valueEnum={{
          DRAFT: '草稿',
          PUBLISHED: '已发布',
        }}
      />
      <ProFormDatePicker name="startDate" label="开始日期" />
      <ProFormDatePicker name="endDate" label="结束日期" />
    </ModalForm>
  );
};

export default NoticeEditModal;
