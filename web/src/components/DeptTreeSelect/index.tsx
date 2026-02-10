import { ProFormTreeSelect } from '@ant-design/pro-components';
import type { ProFormTreeSelectProps } from '@ant-design/pro-components';
import { listDeptTree, type DeptItem } from '@/services/dept';

/**
 * 将部门树形数据转换为 TreeSelect 需要的格式
 */
const convertToTreeOptions = (tree: DeptItem[]): any[] => {
  return tree.map((item) => ({
    title: item.deptName,
    value: item.deptId,
    key: item.deptId,
    children: item.children ? convertToTreeOptions(item.children) : undefined,
  }));
};

/**
 * 加载部门树选项数据，可用于 ProTable 列的 request 属性
 */
export const requestDeptTreeOptions = async () => {
  try {
    const res = await listDeptTree();
    if (res.code === 0 && res.data) {
      return convertToTreeOptions(res.data);
    }
    return [];
  } catch {
    return [];
  }
};

type DeptTreeSelectProps = Omit<ProFormTreeSelectProps, 'request'>;

/**
 * 部门树形选择组件
 * 自动加载部门数据，支持多选
 *
 * @author ding.shichen
 */
const DeptTreeSelect: React.FC<DeptTreeSelectProps> = ({
  name = 'deptIds',
  label = '部门',
  placeholder,
  fieldProps,
  ...restProps
}) => {
  return (
    <ProFormTreeSelect
      name={name}
      label={label}
      placeholder={placeholder ?? '请选择部门'}
      request={requestDeptTreeOptions}
      fieldProps={{
        multiple: true,
        treeCheckable: true,
        showCheckedStrategy: 'SHOW_ALL',
        allowClear: true,
        ...fieldProps,
      }}
      {...restProps}
    />
  );
};

export default DeptTreeSelect;
