import {
  ModalForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { App, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { getDeptDetail, updateDept, type DeptForm, type DeptItem } from '@/services/dept';

export type DeptEditModalProps = {
  deptId: string;
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

const DeptEditModal: React.FC<DeptEditModalProps> = ({ deptId, open, treeData, onCancel, onSubmit }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [editForm] = Form.useForm<DeptForm>();
  const { message } = App.useApp();

  useEffect(() => {
    const loadDetail = async () => {
      if (!deptId) return;
      setLoading(true);
      try {
        const res = await getDeptDetail(deptId);
        if (res.code === 0 && res.data) {
          editForm.setFieldsValue({
            deptName: res.data.deptName,
            deptCode: res.data.deptCode,
            deptDesc: res.data.deptDesc,
            parentDeptId: res.data.parentDeptId,
            sortNo: res.data.sortNo ?? 0,
          });
        }
      } catch (e) {
        message.error('加载机构信息失败');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [deptId]);

  const handleSubmit = async (values: DeptForm) => {
    const hide = message.loading('正在保存机构信息');
    try {
      await updateDept(deptId, values);
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
    <ModalForm<DeptForm>
      title="编辑机构"
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
      />
      <ProFormTextArea name="deptDesc" label="机构描述" />
      <ProFormTreeSelect
        name="parentDeptId"
        label="上级机构"
        placeholder="请选择上级机构"
        fieldProps={{
          treeData: convertTreeToOptions(
            treeData.filter((item) => item.deptId !== deptId),
          ),
          allowClear: true,
          treeDefaultExpandAll: true,
        }}
      />
    </ModalForm>
  );
};

export default DeptEditModal;
