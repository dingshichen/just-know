package cn.dsc.jk.mapper;

import cn.dsc.jk.entity.UserRoleRelEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户角色关系Mapper接口
 *
 * @author ding.shichen
 */
@Mapper
public interface UserRoleMapper extends BaseMapper<UserRoleRelEntity> {

    /**
     * 根据用户ID查询角色ID列表
     *
     * @param userId 用户ID
     * @return 角色ID列表
     */
    List<Long> selectRoleIdsByUserId(@Param("userId") Long userId);

    /**
     * 根据角色ID查询用户ID列表
     *
     * @param roleId 角色ID
     * @return 用户ID列表
     */
    List<Long> selectUserIdsByRoleId(@Param("roleId") Long roleId);

    /**
     * 根据用户ID删除关系
     *
     * @param userId 用户ID
     * @return 影响行数
     */
    int deleteByUserId(@Param("userId") Long userId);

    /**
     * 批量插入
     *
     * @param userRoles 用户角色关系列表
     * @return 影响行数
     */
    int insertBatch(@Param("userRoles") List<UserRoleRelEntity> userRoles);
}
