package cn.dsc.jk.service.impl;

import cn.dsc.jk.entity.RolePermissionRelEntity;
import cn.dsc.jk.mapper.RolePermissionMapper;
import cn.dsc.jk.service.RolePermissionService;
import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 角色权限关系服务实现类
 *
 * @author ding.shichen
 */
@Service
public class RolePermissionServiceImpl extends ServiceImpl<RolePermissionMapper, RolePermissionRelEntity> implements RolePermissionService {

    @Override
    public List<Long> getPermissionIdsByRoleId(Long roleId) {
        return this.baseMapper.selectPermissionIdsByRoleId(roleId);
    }

    @Override
    public List<Long> getRoleIdsByPermissionId(Long permissionId) {
        return this.baseMapper.selectRoleIdsByPermissionId(permissionId);
    }

    @Override
    @Transactional
    public boolean deleteByRoleId(Long roleId) {
        return this.baseMapper.deleteByRoleId(roleId) > 0;
    }

    @Override
    @Transactional
    public void assignPermissions(Long roleId, List<Long> permissionIds) {
        // 先删除原有关系
        this.deleteByRoleId(roleId);

        // 如果有新的权限，批量插入
        if (CollUtil.isNotEmpty(permissionIds)) {
            List<RolePermissionRelEntity> rolePermissions = permissionIds.stream().map(permissionId -> {
                RolePermissionRelEntity rolePermission = new RolePermissionRelEntity();
                rolePermission.setRoleId(roleId);
                rolePermission.setPermissionId(permissionId);
                return rolePermission;
            }).collect(Collectors.toList());
            this.baseMapper.insertBatch(rolePermissions);
        }
    }
}
