import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import type {
  OperateLogItem,
  OperateLogPageParams,
} from '@/services/ant-design-pro/operateLog';
import { pageOperateLogs } from '@/services/ant-design-pro/operateLog';

const OperateLogs: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<OperateLogItem>[] = [
    {
      title: '操作模块',
      dataIndex: 'opsModule',
    },
    {
      title: '操作名称',
      dataIndex: 'opsName',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      title: '设备',
      dataIndex: 'device',
      search: false,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      search: false,
    },
    {
      title: '耗时（ms）',
      dataIndex: 'costTime',
      search: false,
    },
    {
      title: '时间',
      dataIndex: 'createdTime',
      valueType: 'dateTime',
      search: {
        transform: (value: [string, string]) => {
          return {
            startTime: value?.[0],
            endTime: value?.[1],
          };
        },
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<OperateLogItem, OperateLogPageParams>
        headerTitle="操作日志"
        rowKey="logId"
        actionRef={actionRef}
        columns={columns}
        search={{
          labelWidth: 100,
        }}
        request={async (params) => {
          const { current, pageSize, createdTime, ...rest } = params as any;
          const res = await pageOperateLogs({
            pageNum: current,
            pageSize,
            ...rest,
          });
          const list = (res.data?.list || []).map((item: any) => ({
            ...item,
            logId: item.logId != null ? String(item.logId) : item.logId,
            userId: item.userId != null ? String(item.userId) : item.userId,
          }));
          return {
            data: list,
            success: res.code === 0,
            total: res.data?.total || 0,
          };
        }}
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={false}
        rowSelection={false}
      />
    </PageContainer>
  );
};

export default OperateLogs;

