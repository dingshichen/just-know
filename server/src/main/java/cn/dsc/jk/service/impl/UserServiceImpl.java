package cn.dsc.jk.service.impl;

import cn.dsc.jk.common.SecurityConstant;
import cn.dsc.jk.config.security.SessionTokenContext;
import cn.dsc.jk.dto.login.LoginSessionInfo;
import cn.dsc.jk.exception.BizException;
import cn.dsc.jk.dto.attach.AttachOption;
import cn.dsc.jk.dto.dept.DeptOption;
import cn.dsc.jk.dto.permission.GrantedAuthorityPermission;
import cn.dsc.jk.dto.role.RoleOption;
import cn.dsc.jk.dto.user.UserConvert;
import cn.dsc.jk.dto.user.UserCreate;
import cn.dsc.jk.dto.user.UserDetail;
import cn.dsc.jk.dto.user.UserItem;
import cn.dsc.jk.dto.user.UserOption;
import cn.dsc.jk.dto.user.UserPageQuery;
import cn.dsc.jk.dto.user.UserSimpleDetail;
import cn.dsc.jk.dto.user.UserUpdate;
import cn.dsc.jk.entity.UserEntity;
import cn.dsc.jk.entity.UserRoleRelEntity;
import cn.dsc.jk.mapper.UserMapper;
import cn.dsc.jk.service.AttachService;
import cn.dsc.jk.service.DeptService;
import cn.dsc.jk.service.RoleService;
import cn.dsc.jk.service.UserCredentialService;
import cn.dsc.jk.service.UserDeptRelService;
import cn.dsc.jk.service.UserRelRoleService;
import cn.dsc.jk.service.UserService;
import cn.dsc.jk.entity.UserDeptRelEntity;
import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
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
    private UserRelRoleService userRoleRelService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private UserDeptRelService userDeptRelService;

    @Autowired
    private DeptService deptService;

    @Autowired
    private AttachService attachService;

    @Autowired
    private UserCredentialService userCredentialService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SessionTokenContext sessionTokenContext;

    @Override
    public UserOption selectById(Long userId) {
        UserEntity entity = this.getById(userId);
        if (entity == null) {
            return null;
        }
        return UserConvert.FU_TO_OPTION.apply(entity);
    }

    @Override
    public List<UserOption> selectByIds(List<Long> userIds) {
        return this.baseMapper.selectBatchIds(userIds).stream().map(UserConvert.FU_TO_OPTION).collect(Collectors.toList());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserSimpleDetail detail = this.baseMapper.selectSimpleDetailByAccount(username);
        if (detail == null) {
            throw new UsernameNotFoundException("用户不存在");
        }
        List<GrantedAuthorityPermission> permissions = userRoleRelService.getGrantedAuthorityByUserId(detail.getUserId());
        detail.setAuthorities(permissions);
        return detail;
    }

    @Transactional
    public Long create(UserCreate create) {
        UserEntity entity = new UserEntity();
        entity.setUserName(create.getUserName());
        entity.setAvatarAttachId(create.getAvatarAttachId());
        entity.setAccount(create.getAccount());
        entity.setGender(create.getGender());
        entity.setPhone(create.getPhone());
        entity.setEmail(create.getEmail());
        // 设置锁定标志默认值
        if (entity.getLockedFlag() == null) {
            entity.setLockedFlag(false);
        }
        this.save(entity);

        // 写入默认密码 123456
        userCredentialService.setPassword(entity.getUserId(), passwordEncoder.encode(SecurityConstant.DEFAULT_PASSWORD));

        // 处理部门关联
        if (CollUtil.isNotEmpty(create.getDeptIds())) {
            List<UserDeptRelEntity> userDepts = create.getDeptIds().stream().map(deptId -> {
                UserDeptRelEntity userDept = new UserDeptRelEntity();
                userDept.setUserId(entity.getUserId());
                userDept.setDeptId(deptId);
                return userDept;
            }).collect(Collectors.toList());
            userDeptRelService.saveBatch(userDepts);
        }

        // 处理角色关联
        if (CollUtil.isNotEmpty(create.getRoleIds())) {
            List<UserRoleRelEntity> userRoles = create.getRoleIds().stream().map(roleId -> {
                UserRoleRelEntity userRole = new UserRoleRelEntity();
                userRole.setUserId(entity.getUserId());
                userRole.setRoleId(roleId);
                return userRole;
            }).collect(Collectors.toList());
            userRoleRelService.saveBatch(userRoles);
        }

        return entity.getUserId();
    }

    @Override
    @Transactional
    public void update(Long userId, UserUpdate update) {
        UserEntity entity = new UserEntity();
        entity.setUserId(userId);
        entity.setUserName(update.getUserName());
        entity.setAvatarAttachId(update.getAvatarAttachId());
        entity.setAccount(update.getAccount());
        entity.setGender(update.getGender());
        entity.setPhone(update.getPhone());
        entity.setEmail(update.getEmail());
        this.updateById(entity);

        // 处理部门关联：先删除原有关系，再插入新关系
        userDeptRelService.deleteByUserId(userId);
        if (CollUtil.isNotEmpty(update.getDeptIds())) {
            List<UserDeptRelEntity> userDepts = update.getDeptIds().stream().map(deptId -> {
                UserDeptRelEntity userDept = new UserDeptRelEntity();
                userDept.setUserId(userId);
                userDept.setDeptId(deptId);
                return userDept;
            }).collect(Collectors.toList());
            userDeptRelService.saveBatch(userDepts);
        }

        // 处理角色关联：入参包含 roleIds 时先删除原有关系，再插入新关系
        if (update.getRoleIds() != null) {
            userRoleRelService.deleteByUserId(userId);
            if (CollUtil.isNotEmpty(update.getRoleIds())) {
                List<UserRoleRelEntity> userRoles = update.getRoleIds().stream().map(roleId -> {
                    UserRoleRelEntity userRole = new UserRoleRelEntity();
                    userRole.setUserId(userId);
                    userRole.setRoleId(roleId);
                    return userRole;
                }).collect(Collectors.toList());
                userRoleRelService.saveBatch(userRoles);
            }
        }

        // 清除用户会话，强制重新登录
        sessionTokenContext.removeSessionsByUserId(userId);
    }

    @Override
    @Transactional
    public void delete(Long userId) {
        UserEntity entity = this.getById(userId);
        if (entity != null && SecurityConstant.SYS_ADMIN_ACCOUNT.equals(entity.getAccount())) {
            throw new BizException("不能对系统管理员进行删除操作");
        }
        // 清除用户会话
        sessionTokenContext.removeSessionsByUserId(userId);
        // 删除用户角色关系
        userRoleRelService.deleteByUserId(userId);
        // 删除用户部门关系
        userDeptRelService.deleteByUserId(userId);
        // 删除用户凭证
        userCredentialService.removeById(userId);
        // 删除用户
        this.removeById(userId);
    }

    @Override
    @Transactional
    public void deleteBatch(List<Long> userIds) {
        if (CollUtil.isEmpty(userIds)) {
            return;
        }
        for (Long userId : userIds) {
            UserEntity entity = this.getById(userId);
            if (entity != null && SecurityConstant.SYS_ADMIN_ACCOUNT.equals(entity.getAccount())) {
                throw new BizException("不能对系统管理员进行删除操作");
            }
        }
        // 批量清除用户会话
        sessionTokenContext.removeSessionsByUserIds(userIds);
        // 批量删除用户角色关系
        for (Long userId : userIds) {
            userRoleRelService.deleteByUserId(userId);
        }
        // 批量删除用户部门关系
        for (Long userId : userIds) {
            userDeptRelService.deleteByUserId(userId);
        }
        // 批量删除用户凭证
        userCredentialService.removeBatchByIds(userIds);
        // 批量删除用户
        this.removeBatchByIds(userIds);
    }

    @Override
    public UserDetail load(Long userId) {
        UserEntity entity = this.getById(userId);
        if (entity == null) {
            return null;
        }

        UserDetail detail = UserConvert.FU_TO_DETAIL.apply(entity);

        // 加载用户角色
        List<Long> roleIds = userRoleRelService.getRoleIdsByUserId(userId);
        if (CollUtil.isNotEmpty(roleIds)) {
            detail.setRoles(roleService.selectByIds(roleIds));
        }

        // 加载用户部门信息
        List<Long> deptIds = userDeptRelService.getDeptIdsByUserId(userId);
        if (CollUtil.isNotEmpty(deptIds)) {
            detail.setDepts(deptService.selectByIds(deptIds));
        }

        // 加载用户头像
        AttachOption avatar = attachService.getOptionById(entity.getAvatarAttachId());
        detail.setAvatar(avatar);

        // 加载用户登录会话信息
        List<LoginSessionInfo> loginSessions = sessionTokenContext.getUserLoginSessions(userId);
        detail.setLoginSessions(loginSessions);
        
        // 加载创建用户和更新用户
        detail.setCreatedUser(this.selectById(entity.getCreatedUserId()));
        detail.setUpdatedUser(this.selectById(entity.getUpdatedUserId()));
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
                query.getLockedFlag(),
                query.getRoleIds(),
                query.getDeptIds()
        );
        List<UserItem> items = entities.stream()
                .map(UserConvert.FU_TO_ITEM)
                .collect(Collectors.toList());
        // 提取用户ID集合
        List<Long> userIds = entities.stream().map(UserEntity::getUserId).toList();
        // 加载角色信息
        Map<Long, List<RoleOption>> roleOptionsMap = userRoleRelService.listRoleOptionsMapByUserIds(userIds);
        items.forEach(item -> {
            List<RoleOption> roles = roleOptionsMap.get(item.getUserId());
            item.setRoles(roles);
        });

        // 加载用户部门信息
        Map<Long, List<DeptOption>> deptOptionsMap = userDeptRelService.listDeptOptionsMapByUserIds(userIds);
        items.forEach(item -> {
            List<DeptOption> depts = deptOptionsMap.get(item.getUserId());
            item.setDepts(depts);
        });

        // 提取用户头像
        List<Long> avatarAttachIds = entities.stream().map(UserEntity::getAvatarAttachId).filter(Objects::nonNull).toList();
        if (CollUtil.isNotEmpty(avatarAttachIds)) {
            // 加载附件
            Map<Long, AttachOption> attachOptionMap = attachService.selectByIds(avatarAttachIds).stream().collect(Collectors.toMap(AttachOption::getAttachId, Function.identity()));
            // 组装头像
            Map<Long, Long> avatarMap = entities.stream().filter(e -> e.getAvatarAttachId() != null).collect(Collectors.toMap(UserEntity::getUserId, UserEntity::getAvatarAttachId));
            items.forEach(item -> {
                Long avatarAttachId = avatarMap.get(item.getUserId());
                item.setAvatar(attachOptionMap.get(avatarAttachId));
            });
        }
        return new PageInfo<>(items);
    }

    @Override
    @Transactional
    public void lock(Long userId) {
        UserEntity entity = this.getById(userId);
        if (entity == null) {
            return;
        }
        if (SecurityConstant.SYS_ADMIN_ACCOUNT.equals(entity.getAccount())) {
            throw new BizException("不能对系统管理员进行锁定操作");
        }
        entity.setLockedFlag(true);
        this.updateById(entity);
        // 清除用户会话，强制下线
        sessionTokenContext.removeSessionsByUserId(userId);
    }

    @Override
    @Transactional
    public void unlock(Long userId) {
        UserEntity entity = this.getById(userId);
        if (entity == null) {
            return;
        }
        if (SecurityConstant.SYS_ADMIN_ACCOUNT.equals(entity.getAccount())) {
            throw new BizException("不能对系统管理员进行解锁操作");
        }
        entity.setLockedFlag(false);
        this.updateById(entity);
    }

    @Override
    @Transactional
    public void assignRoles(Long userId, List<Long> roleIds) {
        // 先删除原有关系
        userRoleRelService.deleteByUserId(userId);

        // 如果有新的角色，批量插入
        if (CollUtil.isNotEmpty(roleIds)) {
            List<UserRoleRelEntity> userRoles = roleIds.stream().map(roleId -> {
                UserRoleRelEntity userRole = new UserRoleRelEntity();
                userRole.setUserId(userId);
                userRole.setRoleId(roleId);
                return userRole;
            }).collect(Collectors.toList());
            userRoleRelService.saveBatch(userRoles);
        }

    }

    @Override
    public UserSimpleDetail loadSimpleDetail(Long userId) {
        UserSimpleDetail detail = this.baseMapper.selectSimpleDetailById(userId);
        if (detail == null) {
            return null;
        }
        List<GrantedAuthorityPermission> authorities = userRoleRelService.getGrantedAuthorityByUserId(userId);
        detail.setAuthorities(authorities);
        boolean hasAdmin = authorities != null && authorities.stream()
                .anyMatch(a -> SecurityConstant.SYS_ADMIN_ROLE_CODE.equals(a.getPermissionCode()));
        detail.setAccess(hasAdmin ? "admin" : null);
        return detail;
    }

    @Override
    @Transactional
    public void resetPassword(Long userId) {
        UserEntity entity = this.getById(userId);
        if (entity == null) {
            return;
        }
        if (SecurityConstant.SYS_ADMIN_ACCOUNT.equals(entity.getAccount())) {
            throw new BizException("不能对系统管理员进行重置密码操作");
        }
        userCredentialService.setPassword(userId, passwordEncoder.encode(SecurityConstant.DEFAULT_PASSWORD));
        // 清除用户会话，强制重新登录
        sessionTokenContext.removeSessionsByUserId(userId);
    }
}
