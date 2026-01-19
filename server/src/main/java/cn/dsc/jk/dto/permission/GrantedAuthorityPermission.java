package cn.dsc.jk.dto.permission;

import org.springframework.security.core.GrantedAuthority;

import lombok.Data;

@Data
public class GrantedAuthorityPermission implements GrantedAuthority {
    
    /**
     * 权限编码
     */
    private String permissionCode;
    
    @Override
    public String getAuthority() {
        return this.permissionCode;
    }

}
