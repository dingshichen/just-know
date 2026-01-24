package cn.dsc.jk.dto.user;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import cn.dsc.jk.dto.permission.GrantedAuthorityPermission;
import lombok.Data;

/**
 * @author ding.shichen
 */
@Data
public class UserSimpleDetail implements UserDetails {

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 用户姓名（展示用）
     */
    private String userName;

    /**
     * 用户账号
     */
    private String account;

    /**
     * 头像 URL（可选，用于前端展示）
     */
    private String avatar;

    /**
     * 密码（不序列化到 API 响应）
     */
    @JsonIgnore
    private String password;

    /**
     * 是否锁定标志
     */
    private Boolean isLockFlag;

    /**
     * 授权
     */
    private List<GrantedAuthorityPermission> authorities;

    /**
     * 访问级别，如 "admin"，用于前端权限判断
     */
    private String access;


    @Override
    public Collection<GrantedAuthorityPermission> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.account;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.isLockFlag == null || !this.isLockFlag;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
