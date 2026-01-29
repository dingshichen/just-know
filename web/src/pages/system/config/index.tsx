import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, PageContainer, ProFormText, ProTable } from '@ant-design/pro-components';
import { App, Card } from 'antd';
import React, { useRef, useState } from 'react';
import type { SystemConfigItem } from '@/services/ant-design-pro/systemConfig';
import {
  listSystemConfigs,
  updateSystemConfigValue,
} from '@/services/ant-design-pro/systemConfig';
import useStyles from './style.style';

const SystemConfig: React.FC = () => {
  const { styles } = useStyles();
  const actionRef = useRef<ActionType>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<SystemConfigItem | undefined>();
  const { message } = App.useApp();

  const handleUpdateValue = async (values: { configValue: string }) => {
    if (!currentRow?.configKey) return false;
    const hide = message.loading('正在保存配置值');
    try {
      await updateSystemConfigValue({
        configKey: currentRow.configKey,
        configValue: values.configValue,
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
    <PageContainer content="系统配置为初始化数据，仅支持修改配置值。">
      <Card title="配置列表" className={styles.card} variant="borderless">
        <ProTable<SystemConfigItem>
          headerTitle=""
          rowKey="configId"
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
      </Card>

      <ModalForm<{ configValue: string }>
        title="修改配置值"
        open={editModalOpen}
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
        <ProFormText
          name="configValue"
          label="配置值"
          rules={[{ required: true, message: '请输入配置值' }]}
          placeholder="请输入配置值"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default SystemConfig;
