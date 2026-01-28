package cn.dsc.jk.mapper;

import cn.dsc.jk.entity.UserDeptRelEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户机构关系Mapper接口
 *
 * @author ding.shichen
 */
@Mapper
public interface UserDeptRelMapper extends BaseMapper<UserDeptRelEntity> {

    /**
     * 根据用户ID查询机构ID列表
     *
     * @param userId 用户ID
     * @return 机构ID列表
     */
    List<Long> selectDeptIdsByUserId(@Param("userId") Long userId);

    /**
     * 根据机构ID查询用户ID列表
     *
     * @param deptId 机构ID
     * @return 用户ID列表
     */
    List<Long> selectUserIdsByDeptId(@Param("deptId") Long deptId);

    /**
     * 根据用户ID集合查询列表
     * @param userIds 用户Id集合
     * @return 用户机构关系列表
     */
    List<UserDeptRelEntity> selectByUserIds(@Param("userIds") List<Long> userIds);

    /**
     * 根据用户ID删除关系
     *
     * @param userId 用户ID
     * @return 影响行数
     */
    int deleteByUserId(@Param("userId") Long userId);

    /**
     * 根据机构ID删除关系
     *
     * @param deptId 机构ID
     * @return 影响行数
     */
    int deleteByDeptId(@Param("deptId") Long deptId);

    /**
     * 批量插入
     *
     * @param userDepts 用户机构关系列表
     * @return 影响行数
     */
    int insertBatch(@Param("userDepts") List<UserDeptRelEntity> userDepts);
}
