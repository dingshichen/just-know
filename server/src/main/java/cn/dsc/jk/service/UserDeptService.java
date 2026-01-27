package cn.dsc.jk.service;

import cn.dsc.jk.entity.UserDeptRelEntity;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * 用户机构关系服务接口
 *
 * @author ding.shichen
 */
public interface UserDeptService extends IService<UserDeptRelEntity> {

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
     * 根据用户ID删除关系
     *
     * @param userId 用户ID
     * @return 是否成功
     */
    boolean deleteByUserId(Long userId);

    /**
     * 根据机构ID删除关系
     *
     * @param deptId 机构ID
     * @return 是否成功
     */
    boolean deleteByDeptId(Long deptId);
}
