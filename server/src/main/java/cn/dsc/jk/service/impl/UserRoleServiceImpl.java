package cn.dsc.jk.service.impl;

import cn.dsc.jk.dto.permission.GrantedAuthorityPermission;
import cn.dsc.jk.entity.UserRoleRelEntity;
import cn.dsc.jk.mapper.UserRoleMapper;
import cn.dsc.jk.service.UserRoleService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 用户角色关系服务实现类
 *
 * @author ding.shichen
 */
@Service
@RequiredArgsConstructor
public class UserRoleServiceImpl extends ServiceImpl<UserRoleMapper, UserRoleRelEntity> implements UserRoleService {

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
