import { Avatar, Descriptions, Modal, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUserDetail, UserDetail } from '@/services/ant-design-pro/user';
import { UserOutlined } from '@ant-design/icons';

type UserDetailProps = {
  userId: string;
  open: boolean;
  onClose: () => void;
};

const UserDetailModal: React.FC<UserDetailProps> = ({ userId, open, onClose }) => {
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDetail = async () => {
      if (!userId) {
        return;
      }
      const res = await getUserDetail(userId);
      if (res.code === 0 && res.data) {
        setData(res.data);
        setLoading(false);
      }
    };
    loadDetail();
  }, [userId]);

  return (
      <Modal
        title="用户详情"
        open={open}
        footer={null}
        confirmLoading={loading}
        onCancel={onClose}
      >
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="头像">
            {data?.avatar?.attachId ? (
              <Avatar
                src={`/api/attach/download/${data?.avatar?.attachId}`}
                size={64}
                icon={<UserOutlined />}
              />
            ) : (
              <Avatar size={64} icon={<UserOutlined />} />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="用户姓名">
            {data?.userName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="账号">
            {data?.account || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="性别">
            {data?.gender || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="手机号码">
            {data?.phone || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="电子邮箱">
            {data?.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="所属部门">
            {(() => {
              const names = data?.depts?.map((d) => d.deptName) || [];
              return names.length > 0
                ? names.map((name) => (
                    <Tag key={name} style={{ marginRight: 4 }}>
                      {name}
                    </Tag>
                  ))
                : '-';
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="角色">
            {data?.roles?.map((role) => {
                  const isAdmin = role.roleName === '系统管理员';
                  return (
                    <Tag
                      key={role.roleId ?? role.roleName}
                      color={isAdmin ? 'red' : undefined}
                      style={{ marginRight: 4 }}
                    >
                      {role.roleName}
                    </Tag>
                  );
                })
              || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="锁定状态">
            {data?.lockedFlag ? (
              <Tag color="red">已锁定</Tag>
            ) : (
              <Tag color="green">正常</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="在线状态">
            {(Array.isArray(data?.loginSessions) && data.loginSessions.length > 0) ? (
              <Space>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#52c41a',
                    display: 'inline-block',
                  }}
                />
                <span>在线</span>
                {data?.loginSessions?.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {data?.loginSessions?.map((session, index) => (
                      <div key={index} style={{ marginTop: index > 0 ? 8 : 0 }}>
                        <div>
                          <strong>设备：</strong>
                          {session.device || '未知设备'}
                        </div>
                        <div>
                          <strong>IP：</strong>
                          {session.ip || '未知IP'}
                        </div>
                        <div>
                          <strong>浏览器：</strong>
                          {session.browser || '未知浏览器'}
                        </div>
                        {session.loginTime && (
                          <div>
                            <strong>登录时间：</strong>
                            {session.loginTime}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Space>
            ) : (
              <Space>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#d9d9d9',
                    display: 'inline-block',
                  }}
                />
                <span>离线</span>
              </Space>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {data?.createdTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {data?.updatedTime || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
  );
};

export default UserDetailModal;

