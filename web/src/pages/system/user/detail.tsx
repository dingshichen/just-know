import { PageContainer } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Card, Descriptions, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUserDetail } from '@/services/ant-design-pro/user';

type UserDetail = {
  userId: string;
  userName: string;
  account?: string;
  gender?: string;
  phone?: string;
  email?: string;
  deptIds?: string[];
  deptNames?: string[];
};

const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDetail = async () => {
      if (!userId) {
        message.error('缺少用户ID');
        setLoading(false);
        return;
      }
      try {
        const res = await getUserDetail(userId);
        if (res.code === 0 && res.data) {
          setData(res.data);
        } else {
          message.error(res.msg || '加载用户详情失败');
        }
      } catch (e) {
        message.error('加载用户详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [userId]);

  return (
    <PageContainer
      header={{
        title: '用户详情',
        onBack: () => history.back(),
      }}
    >
      <Card loading={loading}>
        {data && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="用户姓名">{data.userName}</Descriptions.Item>
            <Descriptions.Item label="账号">{data.account || '-'}</Descriptions.Item>
            <Descriptions.Item label="性别">{data.gender || '-'}</Descriptions.Item>
            <Descriptions.Item label="手机号码">{data.phone || '-'}</Descriptions.Item>
            <Descriptions.Item label="电子邮箱">{data.email || '-'}</Descriptions.Item>
            <Descriptions.Item label="所属部门">
              {data.deptNames && data.deptNames.length > 0
                ? data.deptNames.map((name) => (
                    <Tag key={name} style={{ marginRight: 4 }}>
                      {name}
                    </Tag>
                  ))
                : '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </PageContainer>
  );
};

export default UserDetailPage;

