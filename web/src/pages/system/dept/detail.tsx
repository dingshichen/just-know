import { PageContainer } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Card, Descriptions, message } from 'antd';
import React, { useEffect, useState } from 'react';
import type { DeptItem } from '@/services/ant-design-pro/dept';
import { getDeptDetail } from '@/services/ant-design-pro/dept';

const DeptDetailPage: React.FC = () => {
  const { deptId } = useParams<{ deptId: string }>();
  const [data, setData] = useState<DeptItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDetail = async () => {
      if (!deptId) {
        message.error('缺少机构ID');
        setLoading(false);
        return;
      }
      try {
        const res = await getDeptDetail(deptId);
        if (res.code === 0 && res.data) {
          setData(res.data);
        } else {
          message.error(res.msg || '加载机构详情失败');
        }
      } catch (e) {
        message.error('加载机构详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [deptId]);

  return (
    <PageContainer
      header={{
        title: '机构详情',
        onBack: () => history.back(),
      }}
    >
      <Card loading={loading}>
        {data && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="机构名称">{data.deptName}</Descriptions.Item>
            <Descriptions.Item label="机构编码">{data.deptCode || '-'}</Descriptions.Item>
            <Descriptions.Item label="机构描述">
              {data.deptDesc || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="上级机构ID">
              {data.parentDeptId || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="顺序编号">
              {data.sortNo ?? '-'}
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

export default DeptDetailPage;

