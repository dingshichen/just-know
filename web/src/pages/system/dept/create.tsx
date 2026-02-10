import {
  ModalForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { App } from 'antd';
import React from 'react';
import { createDept, type DeptForm, type DeptItem } from '@/services/dept';

export type DeptCreateModalProps = {
  open: boolean;
  treeData: DeptItem[];
  onCancel: () => void;
  onSubmit: () => void;
};

/** 将树形数据转换为选项格式 */
const convertTreeToOptions = (tree: DeptItem[]): any[] => {
  return tree.map((item) => ({
    title: item.deptName,
    value: item.deptId,
    children: item.children ? convertTreeToOptions(item.children) : undefined,
  }));
};

const DeptCreateModal: React.FC<DeptCreateModalProps> = ({ open, treeData, onCancel, onSubmit }) => {
  const { message } = App.useApp();

  const handleSubmit = async (values: DeptForm) => {
    const hide = message.loading('正在新增机构');
    try {
      await createDept(values);
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
    <ModalForm<DeptForm>
      title="新建机构"
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
        name="deptName"
        label="机构名称"
        rules={[{ required: true, message: '请输入机构名称' }]}
      />
      <ProFormText name="deptCode" label="机构编码" />
      <ProFormDigit
        name="sortNo"
        label="顺序编号"
        rules={[{ required: true, message: '请输入顺序编号' }]}
        fieldProps={{
          min: 0,
          precision: 0,
        }}
        initialValue={0}
      />
      <ProFormTextArea name="deptDesc" label="机构描述" />
      <ProFormTreeSelect
        name="parentDeptId"
        label="上级机构"
        placeholder="请选择上级机构"
        fieldProps={{
          treeData: convertTreeToOptions(treeData),
          allowClear: true,
          treeDefaultExpandAll: true,
        }}
      />
    </ModalForm>
  );
};

export default DeptCreateModal;
