package cn.dsc.jk.dto.permission;

import java.io.Serial;

import org.springframework.security.core.GrantedAuthority;

import lombok.Data;

@Data
public class GrantedAuthorityPermission implements GrantedAuthority {

    @Serial
    private static final long serialVersionUID = 1L;
    
    /**
     * 权限编码
     */
    private String permissionCode;
    
    @Override
    public String getAuthority() {
        return this.permissionCode;
    }

}
