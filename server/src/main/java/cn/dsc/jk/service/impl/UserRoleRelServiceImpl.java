package cn.dsc.jk.service.impl;

import cn.dsc.jk.dto.permission.GrantedAuthorityPermission;
import cn.dsc.jk.dto.role.RoleOption;
import cn.dsc.jk.entity.UserRoleRelEntity;
import cn.dsc.jk.mapper.UserRoleRelMapper;
import cn.dsc.jk.service.RoleService;
import cn.dsc.jk.service.UserRelRoleService;
import cn.hutool.core.collection.CollUtil;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * 用户角色关系服务实现类
 *
 * @author ding.shichen
 */
@Service
public class UserRoleRelServiceImpl extends ServiceImpl<UserRoleRelMapper, UserRoleRelEntity> implements UserRelRoleService {

    @Autowired
    private RoleService roleService;

    @Override
    public Map<Long, List<RoleOption>> listRoleOptionsMapByUserIds(List<Long> userIds) {
        List<UserRoleRelEntity> relEntities = this.baseMapper.selectByUserIds(userIds);
        if (CollUtil.isEmpty(relEntities)) {
            return new HashMap<>();
        }
        List<Long> roleIds = relEntities.stream().map(UserRoleRelEntity::getRoleId).distinct().toList();
        Map<Long, RoleOption> roleOptionsMap = roleService.mapsByIds(roleIds);
        Map<Long, List<RoleOption>> result = new HashMap<>();
        relEntities.stream().collect(Collectors.groupingBy(UserRoleRelEntity::getUserId)).forEach((userId, userRelList) -> {
            List<RoleOption> roleOptions = userRelList.stream().map(e -> roleOptionsMap.get(e.getRoleId())).filter(Objects::nonNull).toList();
            result.put(userId, roleOptions);
        });
        return result;
    }

    @Override
    public List<Long> getRoleIdsByUserId(Long userId) {
        return this.baseMapper.selectRoleIdsByUserId(userId);
    }

    @Override
    public List<Long> getUserIdsByRoleId(Long roleId) {
        return this.baseMapper.selectUserIdsByRoleId(roleId);
    }

    @Override
    public boolean deleteByUserId(Long userId) {
        return this.baseMapper.deleteByUserId(userId) > 0;
    }

    @Override
    public List<GrantedAuthorityPermission> getGrantedAuthorityByUserId(Long userId) {
        return this.baseMapper.selectGrantedAuthorityByUserId(userId);
    }


}
