package cn.dsc.jk.service.impl;

import cn.dsc.jk.dto.permission.GrantedAuthorityPermission;
import cn.dsc.jk.dto.role.RoleOption;
import cn.dsc.jk.dto.user.UserCreate;
import cn.dsc.jk.dto.user.UserDetail;
import cn.dsc.jk.dto.user.UserItem;
import cn.dsc.jk.dto.user.UserPageQuery;
import cn.dsc.jk.dto.user.UserSimpleDetail;
import cn.dsc.jk.dto.user.UserUpdate;
import cn.dsc.jk.entity.RoleEntity;
import cn.dsc.jk.entity.UserEntity;
import cn.dsc.jk.entity.UserRoleRelEntity;
import cn.dsc.jk.mapper.UserMapper;
import cn.dsc.jk.service.DeptService;
import cn.dsc.jk.service.RoleService;
import cn.dsc.jk.service.UserDeptService;
import cn.dsc.jk.service.UserRoleService;
import cn.dsc.jk.service.UserService;
import cn.dsc.jk.entity.DeptEntity;
import cn.dsc.jk.entity.UserDeptRelEntity;
import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户服务实现类
 *
 * @author ding.shichen
 */
@Slf4j
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, UserEntity> implements UserService {

    @Autowired
    private UserRoleService userRoleService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private UserDeptService userDeptService;

    @Autowired
    private DeptService deptService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserSimpleDetail detail = this.baseMapper.selectSimpleDetailByAccount(username);
        if (detail == null) {
            throw new UsernameNotFoundException("用户不存在");
        }
        List<GrantedAuthorityPermission> permissions = userRoleService.getGrantedAuthorityByUserId(detail.getUserId());
        detail.setAuthorities(permissions);
        return detail;
    }

    @Transactional
    public Long create(UserCreate create) {
        UserEntity entity = new UserEntity();
        BeanUtils.copyProperties(create, entity);
        // 设置锁定标志默认值
        if (entity.getLockedFlag() == null) {
            entity.setLockedFlag(false);
        }
        this.save(entity);
        
        // 处理部门关联
        if (CollUtil.isNotEmpty(create.getDeptIds())) {
            List<UserDeptRelEntity> userDepts = create.getDeptIds().stream().map(deptId -> {
                UserDeptRelEntity userDept = new UserDeptRelEntity();
                userDept.setUserId(entity.getUserId());
                userDept.setDeptId(deptId);
                return userDept;
            }).collect(Collectors.toList());
            userDeptService.saveBatch(userDepts);
        }
        
        return entity.getUserId();
    }

    @Override
    @Transactional
    public void update(Long userId, UserUpdate update) {
        UserEntity entity = new UserEntity();
        entity.setUserId(userId);
        BeanUtils.copyProperties(update, entity);
        this.updateById(entity);
        
        // 处理部门关联：先删除原有关系，再插入新关系
        userDeptService.deleteByUserId(userId);
        if (CollUtil.isNotEmpty(update.getDeptIds())) {
            List<UserDeptRelEntity> userDepts = update.getDeptIds().stream().map(deptId -> {
                UserDeptRelEntity userDept = new UserDeptRelEntity();
                userDept.setUserId(userId);
                userDept.setDeptId(deptId);
                return userDept;
            }).collect(Collectors.toList());
            userDeptService.saveBatch(userDepts);
        }
    }

    @Override
    @Transactional
    public void delete(Long userId) {
        // 删除用户角色关系
        userRoleService.deleteByUserId(userId);
        // 删除用户部门关系
        userDeptService.deleteByUserId(userId);
        // 删除用户
        this.removeById(userId);
    }

    @Override
    @Transactional
    public void deleteBatch(List<Long> userIds) {
        if (CollUtil.isEmpty(userIds)) {
            return;
        }
        // 批量删除用户角色关系
        for (Long userId : userIds) {
            userRoleService.deleteByUserId(userId);
        }
        // 批量删除用户部门关系
        for (Long userId : userIds) {
            userDeptService.deleteByUserId(userId);
        }
        // 批量删除用户
        this.removeBatchByIds(userIds);
    }

    @Override
    public UserDetail load(Long userId) {
        UserEntity entity = this.getById(userId);
        if (entity == null) {
            return null;
        }

        UserDetail detail = new UserDetail();
        BeanUtils.copyProperties(entity, detail);

        // 加载用户角色
        List<Long> roleIds = userRoleService.getRoleIdsByUserId(userId);
        if (CollUtil.isNotEmpty(roleIds)) {
            List<RoleEntity> roleEntities = roleService.listByIds(roleIds);
            List<RoleOption> roles = roleEntities.stream().map(role -> {
                RoleOption option = new RoleOption();
                option.setRoleId(role.getRoleId());
                option.setRoleName(role.getRoleName());
                return option;
            }).collect(Collectors.toList());
            detail.setRoles(roles);
        } else {
            detail.setRoles(new ArrayList<>());
        }

        // 加载用户部门信息
        List<Long> deptIds = userDeptService.getDeptIdsByUserId(userId);
        detail.setDeptIds(deptIds != null ? deptIds : new ArrayList<>());
        if (CollUtil.isNotEmpty(deptIds)) {
            List<DeptEntity> deptEntities = deptService.listByIds(deptIds);
            List<String> deptNames = deptEntities.stream()
                    .map(DeptEntity::getDeptName)
                    .collect(Collectors.toList());
            detail.setDeptNames(deptNames);
        } else {
            detail.setDeptNames(new ArrayList<>());
        }

        return detail;
    }

    @Override
    public PageInfo<UserItem> page(UserPageQuery query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<UserEntity> entities = this.baseMapper.selectList(
                query.getUserName(),
                query.getAccount(),
                query.getPhone(),
                query.getEmail(),
                query.getLockedFlag()
        );

        List<UserItem> items = entities.stream().map(entity -> {
            UserItem item = new UserItem();
            BeanUtils.copyProperties(entity, item);
            
            // 填充部门信息
            List<Long> deptIds = userDeptService.getDeptIdsByUserId(entity.getUserId());
            if (CollUtil.isNotEmpty(deptIds)) {
                List<DeptEntity> deptEntities = deptService.listByIds(deptIds);
                List<String> deptNames = deptEntities.stream()
                        .map(DeptEntity::getDeptName)
                        .collect(Collectors.toList());
                item.setDeptNames(deptNames);
            } else {
                item.setDeptNames(new ArrayList<>());
            }
            
            return item;
        }).collect(Collectors.toList());

        return new PageInfo<>(items);
    }

    @Override
    @Transactional
    public void lock(Long userId) {
        UserEntity entity = this.getById(userId);
        if (entity == null) {
            return;
        }
        entity.setLockedFlag(true);
        this.updateById(entity);
    }

    @Override
    @Transactional
    public void unlock(Long userId) {
        UserEntity entity = this.getById(userId);
        if (entity == null) {
            return;
        }
        entity.setLockedFlag(false);
        this.updateById(entity);
    }

    @Override
    @Transactional
    public void assignRoles(Long userId, List<Long> roleIds) {
        // 先删除原有关系
        userRoleService.deleteByUserId(userId);

        // 如果有新的角色，批量插入
        if (CollUtil.isNotEmpty(roleIds)) {
            List<UserRoleRelEntity> userRoles = roleIds.stream().map(roleId -> {
                UserRoleRelEntity userRole = new UserRoleRelEntity();
                userRole.setUserId(userId);
                userRole.setRoleId(roleId);
                return userRole;
            }).collect(Collectors.toList());
            userRoleService.saveBatch(userRoles);
        }

    }

    @Override
    public UserSimpleDetail loadSimpleDetail(Long userId) {
        UserSimpleDetail detail = this.baseMapper.selectSimpleDetailById(userId);
        if (detail == null) {
            return null;
        }
        List<GrantedAuthorityPermission> authorities = userRoleService.getGrantedAuthorityByUserId(userId);
        detail.setAuthorities(authorities);
        boolean hasAdmin = authorities != null && authorities.stream()
                .anyMatch(a -> "admin".equals(a.getPermissionCode()));
        detail.setAccess(hasAdmin ? "admin" : null);
        return detail;
    }
}
