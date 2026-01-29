import { PageContainer } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Card, Descriptions, message } from 'antd';
import React, { useEffect, useState } from 'react';
import type { RoleItem } from '@/services/ant-design-pro/role';
import { getRoleDetail } from '@/services/ant-design-pro/role';

const RoleDetailPage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const [data, setData] = useState<RoleItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDetail = async () => {
      if (!roleId) {
        message.error('缺少角色ID');
        setLoading(false);
        return;
      }
      try {
        const res = await getRoleDetail(Number(roleId));
        if (res.code === 0 && res.data) {
          setData(res.data);
        } else {
          message.error(res.msg || '加载角色详情失败');
        }
      } catch (e) {
        message.error('加载角色详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [roleId]);

  return (
    <PageContainer
      header={{
        title: '角色详情',
        onBack: () => history.back(),
      }}
    >
      <Card loading={loading}>
        {data && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="角色名称">{data.roleName}</Descriptions.Item>
            <Descriptions.Item label="角色编码">{data.roleCode}</Descriptions.Item>
            <Descriptions.Item label="角色描述">
              {data.roleDesc || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {data.createdTime || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {data.updatedTime || '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </PageContainer>
  );
};

export default RoleDetailPage;

