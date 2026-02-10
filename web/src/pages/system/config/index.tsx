import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import type { SystemConfigItem } from '@/services/systemConfig';
import { listSystemConfigs } from '@/services/systemConfig';
import ConfigEditModal from './edit';

const SystemConfig: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<SystemConfigItem | undefined>();

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

      <ConfigEditModal
        currentRow={currentRow}
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setCurrentRow(undefined);
        }}
        onSubmit={() => {
          setEditModalOpen(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default SystemConfig;
