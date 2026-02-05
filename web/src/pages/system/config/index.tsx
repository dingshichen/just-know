import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { App } from 'antd';
import React, { useRef, useState } from 'react';
import type { SystemConfigItem } from '@/services/ant-design-pro/systemConfig';
import {
  listSystemConfigs,
  updateSystemConfigValue,
} from '@/services/ant-design-pro/systemConfig';

/** 与后端 SystemConfigKey 对齐的配置键 */
const CONFIG_KEY = {
  USER_INITIAL_PASSWORD: 'user.initial.password',
  USER_FORCE_CHANGE_PASSWORD: 'user.force_change_password_on_first_login',
  PASSWORD_ENCODER: 'security.password_encoder',
  USER_LOGIN_EXPIRE_HOURS: 'user.login.expire_hours',
  PERMISSION_ALLOW_ONLINE_OPERATION: 'permission.allow_online_operation',
} as const;

const FORCE_CHANGE_OPTIONS = [
  { label: '是', value: 'true' },
  { label: '否', value: 'false' },
];

const PASSWORD_ENCODER_OPTIONS = [
  { label: 'bcrypt', value: 'bcrypt' },
  { label: 'pbkdf2', value: 'pbkdf2' },
  { label: 'scrypt', value: 'scrypt' },
  { label: 'argon2', value: 'argon2' },
  { label: 'noop', value: 'noop' },
];

const SystemConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<SystemConfigItem | undefined>();
  const { message } = App.useApp();

  const handleUpdateValue = async (values: { configValue: string | number }) => {
    if (!currentRow?.configKey) return false;
    const configValue = values.configValue == null ? '' : String(values.configValue);
    const hide = message.loading('正在保存配置值');
    try {
      await updateSystemConfigValue({
        configKey: currentRow.configKey,
        configValue,
      });
      hide();
      message.success('保存成功');
      setEditModalOpen(false);
      setCurrentRow(undefined);
      actionRef.current?.reload();
      return true;
    } catch (e) {
      hide();
      message.error('保存失败，请稍后重试');
      return false;
    }
  };

  const columns: ProColumns<SystemConfigItem>[] = [
    {
      title: '配置名称',
      dataIndex: 'configName',
    },
    {
      title: '配置键',
      dataIndex: 'configKey',
    },
    {
      title: '配置值',
      dataIndex: 'configValue',
    },
    {
      title: '配置描述',
      dataIndex: 'configDesc',
      valueType: 'textarea',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentRow(record);
            setEditModalOpen(true);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<SystemConfigItem>
        headerTitle="参数设置"
        rowKey="configKey"
        actionRef={actionRef}
        columns={columns}
        search={false}
        pagination={false}
        request={async () => {
          const res = await listSystemConfigs();
          const list = res.data || [];
          return {
            data: list,
            success: res.code === 0,
            total: list.length,
          };
        }}
      />

      <ModalForm<{ configValue: string | number }>
        title="修改配置值"
        open={editModalOpen}
        initialValues={{
          configName: currentRow?.configName,
          configKey: currentRow?.configKey,
          configValue:
            currentRow?.configKey === CONFIG_KEY.USER_LOGIN_EXPIRE_HOURS
              ? (currentRow?.configValue ? Number(currentRow.configValue) : undefined)
              : currentRow?.configValue,
        }}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => {
            setEditModalOpen(false);
            setCurrentRow(undefined);
          },
        }}
        onFinish={async (values) => {
          return handleUpdateValue(values);
        }}
      >
        <ProFormText name="configName" label="配置名称" disabled />
        <ProFormText name="configKey" label="配置键" disabled />
        {currentRow?.configKey === CONFIG_KEY.USER_FORCE_CHANGE_PASSWORD && (
          <ProFormSelect
            name="configValue"
            label="配置值"
            rules={[{ required: true, message: '请选择' }]}
            options={FORCE_CHANGE_OPTIONS}
            placeholder="请选择"
          />
        )}
        {currentRow?.configKey === CONFIG_KEY.PASSWORD_ENCODER && (
          <ProFormSelect
            name="configValue"
            label="配置值"
            rules={[{ required: true, message: '请选择密码器' }]}
            options={PASSWORD_ENCODER_OPTIONS}
            placeholder="请选择密码器"
          />
        )}
        {currentRow?.configKey === CONFIG_KEY.USER_LOGIN_EXPIRE_HOURS && (
          <ProFormDigit
            name="configValue"
            label="配置值（小时）"
            rules={[{ required: true, message: '请输入小时数' }]}
            min={1}
            max={720}
            fieldProps={{ precision: 0 }}
            placeholder="请输入小时数"
          />
        )}
        {currentRow?.configKey === CONFIG_KEY.USER_INITIAL_PASSWORD && (
          <ProFormText.Password
            name="configValue"
            label="用户初始密码"
            rules={[
              { required: true, message: '请输入用户初始密码' },
              { min: 6, message: '密码长度不能少于6位' },
              { max: 32, message: '密码长度不能超过32位' },
            ]}
            placeholder="请输入用户初始密码"
          />
        )}
        {currentRow?.configKey === CONFIG_KEY.PERMISSION_ALLOW_ONLINE_OPERATION && (
          <ProFormSelect
            name="configValue"
            label="配置值"
            rules={[{ required: true, message: '请选择' }]}
            options={FORCE_CHANGE_OPTIONS}
            placeholder="请选择（是=允许在权限定义菜单操作，否=仅可查看）"
          />
        )}
        {currentRow?.configKey &&
          currentRow.configKey !== CONFIG_KEY.USER_INITIAL_PASSWORD &&
          currentRow.configKey !== CONFIG_KEY.USER_FORCE_CHANGE_PASSWORD &&
          currentRow.configKey !== CONFIG_KEY.PASSWORD_ENCODER &&
          currentRow.configKey !== CONFIG_KEY.USER_LOGIN_EXPIRE_HOURS &&
          currentRow.configKey !== CONFIG_KEY.PERMISSION_ALLOW_ONLINE_OPERATION && (
            <ProFormText
              name="configValue"
              label="配置值"
              rules={[{ required: true, message: '请输入配置值' }]}
              placeholder="请输入配置值"
            />
          )}
      </ModalForm>
    </PageContainer>
  );
};

export default SystemConfig;
