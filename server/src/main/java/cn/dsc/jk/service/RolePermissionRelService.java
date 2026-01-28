package cn.dsc.jk.service;

import cn.dsc.jk.entity.RolePermissionRelEntity;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * 角色权限关系服务接口
 *
 * @author ding.shichen
 */
public interface RolePermissionRelService extends IService<RolePermissionRelEntity> {

    /**
     * 根据角色ID查询权限ID列表
     *
     * @param roleId 角色ID
     * @return 权限ID列表
     */
    List<Long> getPermissionIdsByRoleId(Long roleId);

    /**
     * 根据权限ID查询角色ID列表
     *
     * @param permissionId 权限ID
     * @return 角色ID列表
     */
    List<Long> getRoleIdsByPermissionId(Long permissionId);

    /**
     * 根据角色ID删除关系
     *
     * @param roleId 角色ID
     * @return 是否成功
     */
    boolean deleteByRoleId(Long roleId);

    /**
     * 分配权限给角色
     *
     * @param roleId 角色ID
     * @param permissionIds 权限ID列表
     */
    void assignPermissions(Long roleId, List<Long> permissionIds);
}
