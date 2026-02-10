import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { App } from 'antd';
import React from 'react';
import {
  updateSystemConfigValue,
  type SystemConfigItem,
} from '@/services/systemConfig';

/** 与后端 SystemConfigKey 对齐的配置键 */
const CONFIG_KEY = {
  USER_INITIAL_PASSWORD: 'user.initial.password',
  USER_FORCE_CHANGE_PASSWORD: 'user.force_change_password_on_first_login',
  PASSWORD_ENCODER: 'security.password_encoder',
  USER_LOGIN_EXPIRE_HOURS: 'user.login.expire_hours',
  USER_LOGIN_CAPTCHA: 'user.login.captcha',
  USER_LOGIN_SAVE_LOGIN_FAIL: 'user.login.save_login_fail',
  USER_LOGIN_ALLOW_MULTI_CLIENT: 'user.login.allow_multi_client',
  PERMISSION_ALLOW_ONLINE_OPERATION: 'permission.allow_online_operation',
} as const;

const BOOLEAN_OPTIONS = [
  { label: 'true', value: 'true' },
  { label: 'false', value: 'false' },
];

const PASSWORD_ENCODER_OPTIONS = [
  { label: 'bcrypt', value: 'bcrypt' },
  { label: 'pbkdf2', value: 'pbkdf2' },
  { label: 'scrypt', value: 'scrypt' },
  { label: 'argon2', value: 'argon2' },
  { label: 'noop', value: 'noop' },
];

export type ConfigEditModalProps = {
  currentRow: SystemConfigItem | undefined;
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

const ConfigEditModal: React.FC<ConfigEditModalProps> = ({ currentRow, open, onCancel, onSubmit }) => {
  const { message } = App.useApp();

  const handleSubmit = async (values: { configValue: string | number }) => {
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
      onSubmit();
      return true;
    } catch (e) {
      hide();
      message.error('保存失败，请稍后重试');
      return false;
    }
  };

  return (
    <ModalForm<{ configValue: string | number }>
      title="修改配置值"
      open={open}
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
        onCancel: onCancel,
      }}
      onFinish={async (values) => {
        return handleSubmit(values);
      }}
    >
      <ProFormText name="configName" label="配置名称" disabled />
      <ProFormText name="configKey" label="配置键" disabled />
      {currentRow?.configKey === CONFIG_KEY.USER_FORCE_CHANGE_PASSWORD && (
        <ProFormSelect
          name="configValue"
          label="配置值"
          rules={[{ required: true, message: '请选择' }]}
          options={BOOLEAN_OPTIONS}
          placeholder="请选择"
        />
      )}
      {currentRow?.configKey === CONFIG_KEY.USER_LOGIN_CAPTCHA && (
        <ProFormSelect
          name="configValue"
          label="配置值"
          rules={[{ required: true, message: '请选择' }]}
          options={BOOLEAN_OPTIONS}
          placeholder="请选择"
        />
      )}
      {currentRow?.configKey === CONFIG_KEY.USER_LOGIN_SAVE_LOGIN_FAIL && (
        <ProFormSelect
          name="configValue"
          label="配置值"
          rules={[{ required: true, message: '请选择' }]}
          options={BOOLEAN_OPTIONS}
          placeholder="请选择"
        />
      )}
      {currentRow?.configKey === CONFIG_KEY.USER_LOGIN_ALLOW_MULTI_CLIENT && (
        <ProFormSelect
          name="configValue"
          label="配置值"
          rules={[{ required: true, message: '请选择' }]}
          options={BOOLEAN_OPTIONS}
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
          options={BOOLEAN_OPTIONS}
          placeholder="请选择（true=允许在权限定义菜单操作，false=仅可查看）"
        />
      )}
      {currentRow?.configKey &&
        currentRow.configKey !== CONFIG_KEY.USER_INITIAL_PASSWORD &&
        currentRow.configKey !== CONFIG_KEY.USER_FORCE_CHANGE_PASSWORD &&
        currentRow.configKey !== CONFIG_KEY.USER_LOGIN_CAPTCHA &&
        currentRow.configKey !== CONFIG_KEY.USER_LOGIN_SAVE_LOGIN_FAIL &&
        currentRow.configKey !== CONFIG_KEY.USER_LOGIN_ALLOW_MULTI_CLIENT &&
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
  );
};

export default ConfigEditModal;
