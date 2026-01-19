package cn.dsc.jk.dto.login;

import lombok.Data;

/**
 * 登录请求DTO
 *
 * @author ding.shichen
 */
@Data
public class LoginRequest {

    /**
     * 账号
     */
    private String username;

    /**
     * 密码
     */
    private String password;

    /**
     * 验证码
     */
    private String captcha;

    /**
     * 验证码ID
     */
    private String captchaId;

    /**
     * 自动登录
     */
    private Boolean autoLogin;

    /**
     * 登录类型
     */
    private String type;
}
