package cn.dsc.jk.dto.user;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;

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
     * 用户账号
     */
    private String account;
    
    /**
     * 密码
     */
    private String password;

    /**
     * 是否锁定标志
     */
    private Boolean isLockFlag;

    /**
     * 授权
     */
    private List<GrantedAuthorityPermission> authorities;


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
