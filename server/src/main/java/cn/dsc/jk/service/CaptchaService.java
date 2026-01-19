package cn.dsc.jk.service;

import cn.dsc.jk.consts.ValidateResult;
import cn.dsc.jk.dto.login.CaptchaDetail;

/**
 * 验证码服务接口
 *
 * @author ding.shichen
 */
public interface CaptchaService {

    /**
     * 生成图形验证码
     *
     * @return 验证码响应
     */
    CaptchaDetail generateCaptcha();

    /**
     * 校验验证码
     *
     * @param captchaId 验证码ID
     * @param captcha   用户输入的验证码
     * @return 校验结果
     */
    ValidateResult validateCaptcha(String captchaId, String captcha);
}

