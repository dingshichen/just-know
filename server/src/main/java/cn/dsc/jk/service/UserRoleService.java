package cn.dsc.jk.service;

import cn.dsc.jk.dto.permission.GrantedAuthorityPermission;
import cn.dsc.jk.entity.UserRoleRelEntity;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * 用户角色关系服务接口
 *
 * @author ding.shichen
 */
public interface UserRoleService extends IService<UserRoleRelEntity> {

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
