package cn.dsc.jk.service;

import cn.dsc.jk.dto.dept.DeptOption;
import cn.dsc.jk.entity.UserDeptRelEntity;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

/**
 * 用户机构关系服务接口
 *
 * @author ding.shichen
 */
public interface UserDeptRelService extends IService<UserDeptRelEntity> {

    /**
     * 根据用户ID查询机构ID列表
     *
     * @param userId 用户ID
     * @return 机构ID列表
     */
    List<Long> getDeptIdsByUserId(Long userId);

    /**
     * 根据机构ID查询用户ID列表
     *
     * @param deptId 机构ID
     * @return 用户ID列表
     */
    List<Long> getUserIdsByDeptId(Long deptId);

    /**
     * 根据用户ID列表查询
     * 
     * @param userIds 用户Id集合
     * @return 用户机构关系列表
     */
    List<UserDeptRelEntity> getByUserIds(List<Long> userIds);

    /**
     * 根据用户ID删除关系
     *
     * @param userId 用户ID
     * @return 是否成功
     */
    boolean deleteByUserId(Long userId);

    /**
     * 根据用户ID列表查询机构选项映射
     *
     * @param userIds 用户ID列表
     * @return key 为用户ID，value 为机构选项列表
     */
    Map<Long, List<DeptOption>> listDeptOptionsMapByUserIds(List<Long> userIds);

    /**
     * 根据机构ID删除关系
     *
     * @param deptId 机构ID
     * @return 是否成功
     */
    boolean deleteByDeptId(Long deptId);
}
