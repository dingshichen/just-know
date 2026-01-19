package cn.dsc.jk.dto.login;

import lombok.Data;

/**
 * 登录响应DTO
 *
 * @author ding.shichen
 */
@Data
public class LoginResponse {

    /**
     * 当前权限
     */
    private String currentAuthority;

    /**
     * JWT token
     */
    private String token;
}
