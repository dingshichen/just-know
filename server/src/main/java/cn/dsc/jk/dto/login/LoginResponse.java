package cn.dsc.jk.dto.login;

import java.util.List;

import cn.dsc.jk.dto.permission.GrantedAuthorityPermission;
import lombok.Data;

/**
 * 登录响应DTO
 *
 * @author ding.shichen
 */
@Data
public class LoginResponse {

    /**
     * 权限列表
     */
    private List<GrantedAuthorityPermission> permissions;

    /**
     * JWT token
     */
    private String token;
}
