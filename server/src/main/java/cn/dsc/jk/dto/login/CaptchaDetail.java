package cn.dsc.jk.dto.login;

import lombok.Data;

/**
 * 验证码响应DTO
 *
 * @author ding.shichen
 */
@Data
public class CaptchaDetail {

    /**
     * 验证码ID
     */
    private String captchaId;

    /**
     * 验证码图片（Base64）
     */
    private String captchaImage;
}
