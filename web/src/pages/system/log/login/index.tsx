import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Tag } from 'antd';
import React, { useRef } from 'react';
import type {
  LoginLogItem,
  LoginLogPageParams,
} from '@/services/ant-design-pro/loginLog';
import { pageLoginLogs } from '@/services/ant-design-pro/loginLog';

const LoginLogs: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<LoginLogItem>[] = [
    {
      title: '登录账号',
      dataIndex: 'loginAccount',
    },
    {
      title: '动作类型',
      dataIndex: 'loginActionType',
      valueType: 'select',
      valueEnum: {
        LOGIN_SUCCESS: { text: '登录成功' },
        LOGIN_FAIL: { text: '登录失败' },
        LOGOUT_SUCCESS: { text: '退出成功' },
      },
      render: (_, record) => {
        const type = record.loginActionType;
        const map: Record<string, { color: string; text: string }> = {
          LOGIN_SUCCESS: { color: 'green', text: '登录成功' },
          LOGIN_FAIL: { color: 'red', text: '登录失败' },
          LOGOUT_SUCCESS: { color: 'blue', text: '退出成功' },
        };
        const item = type ? map[type] : undefined;
        return item ? <Tag color={item.color}>{item.text}</Tag> : '-';
      },
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
      <ProTable<LoginLogItem, LoginLogPageParams>
        headerTitle="登录日志"
        rowKey="logId"
        actionRef={actionRef}
        columns={columns}
        search={{
          labelWidth: 100,
        }}
        request={async (params) => {
          const { current, pageSize, createdTime, ...rest } = params as any;
          const res = await pageLoginLogs({
            pageNum: current,
            pageSize,
            ...rest,
          });
          const list = (res.data?.list || []).map((item: any) => ({
            ...item,
            logId: item.logId != null ? String(item.logId) : item.logId,
            loginUserId:
              item.loginUserId != null ? String(item.loginUserId) : item.loginUserId,
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

export default LoginLogs;

