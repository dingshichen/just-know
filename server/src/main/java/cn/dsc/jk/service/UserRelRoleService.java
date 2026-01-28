package cn.dsc.jk.service;

import cn.dsc.jk.dto.permission.GrantedAuthorityPermission;
import cn.dsc.jk.dto.role.RoleOption;
import cn.dsc.jk.entity.UserRoleRelEntity;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

/**
 * 用户角色关系服务接口
 *
 * @author ding.shichen
 */
public interface UserRelRoleService extends IService<UserRoleRelEntity> {

    /**
     * 根据用户ID查询角色ID列表
     *
     * @param userId 用户ID
     * @return 角色ID列表
     */
    List<Long> getRoleIdsByUserId(Long userId);

    /**
     * 根据角色ID查询用户ID列表
     *
     * @param roleId 角色ID
     * @return 用户ID列表
     */
    List<Long> getUserIdsByRoleId(Long roleId);

    /**
     * 根据用户ID列表查询角色选项列表
     *
     * @param userIds 用户ID列表
     * @return 角色选项列表
     */
    Map<Long, List<RoleOption>> listRoleOptionsMapByUserIds(List<Long> userIds);

    /**
     * 根据用户ID删除关系
     *
     * @param userId 用户ID
     * @return 是否成功
     */
    boolean deleteByUserId(Long userId);

    /**
     * 根据用户ID查询授权权限列表
     *
     * @param userId 用户ID
     * @return 授权权限列表
     */
    List<GrantedAuthorityPermission> getGrantedAuthorityByUserId(Long userId);

}
