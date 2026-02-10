import {
  ModalForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App } from 'antd';
import React from 'react';
import { createNotice, type NoticeForm } from '@/services/notice';

export type NoticeCreateModalProps = {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

const NoticeCreateModal: React.FC<NoticeCreateModalProps> = ({ open, onCancel, onSubmit }) => {
  const { message } = App.useApp();

  const handleSubmit = async (values: NoticeForm) => {
    const hide = message.loading('正在新增公告');
    try {
      const res = await createNotice(values);
      if (res.code !== 0 || res.data == null) {
        throw new Error(res.msg || '新增公告失败');
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
    <ModalForm<NoticeForm>
      title="新建公告"
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
        initialValue="DRAFT"
      />
      <ProFormDatePicker name="startDate" label="开始日期" />
      <ProFormDatePicker name="endDate" label="结束日期" />
    </ModalForm>
  );
};

export default NoticeCreateModal;
