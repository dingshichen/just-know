import { ProFormSelect } from '@ant-design/pro-components';
import type { ProFormSelectProps } from '@ant-design/pro-components';
import { listAllRoles, type RoleItem } from '@/services/role';

/**
 * 加载角色选项数据，可用于 ProTable 列的 request 属性
 */
export const requestRoleOptions = async () => {
  try {
    const res = await listAllRoles();
    if (res.code === 0 && res.data) {
      return res.data.map((role: RoleItem) => ({
        label: role.roleName,
        value: role.roleId,
      }));
    }
    return [];
  } catch {
    return [];
  }
};

type RoleSelectProps = Omit<ProFormSelectProps, 'request'>;

/**
 * 角色选择组件
 * 自动加载角色数据，支持多选
 *
 * @author ding.shichen
 */
const RoleSelect: React.FC<RoleSelectProps> = ({
  name = 'roleIds',
  label = '角色',
  placeholder,
  fieldProps,
  ...restProps
}) => {
  return (
    <ProFormSelect
      name={name}
      label={label}
      placeholder={placeholder ?? '请选择角色'}
      request={requestRoleOptions}
      fieldProps={{
        mode: 'multiple',
        ...fieldProps,
      }}
      {...restProps}
    />
  );
};

export default RoleSelect;
