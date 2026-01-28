package cn.dsc.jk.mapper;

import cn.dsc.jk.entity.RolePermissionRelEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 角色权限关系Mapper接口
 *
 * @author ding.shichen
 */
@Mapper
public interface RolePermissionRelMapper extends BaseMapper<RolePermissionRelEntity> {

    /**
     * 根据角色ID查询权限ID列表
     *
     * @param roleId 角色ID
     * @return 权限ID列表
     */
    List<Long> selectPermissionIdsByRoleId(@Param("roleId") Long roleId);

    /**
     * 根据权限ID查询角色ID列表
     *
     * @param permissionId 权限ID
     * @return 角色ID列表
     */
    List<Long> selectRoleIdsByPermissionId(@Param("permissionId") Long permissionId);

    /**
     * 根据角色ID删除关系
     *
     * @param roleId 角色ID
     * @return 影响行数
     */
    int deleteByRoleId(@Param("roleId") Long roleId);

    /**
     * 批量插入
     *
     * @param rolePermissions 角色权限关系列表
     * @return 影响行数
     */
    int insertBatch(@Param("rolePermissions") List<RolePermissionRelEntity> rolePermissions);
}
