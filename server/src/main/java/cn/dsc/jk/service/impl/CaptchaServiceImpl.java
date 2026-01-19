package cn.dsc.jk.service.impl;

import cn.dsc.jk.dto.login.CaptchaDetail;
import cn.dsc.jk.service.CaptchaService;
import cn.dsc.jk.consts.ValidateResult;
import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.LineCaptcha;
import cn.hutool.core.codec.Base64;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import java.io.ByteArrayOutputStream;
import java.time.Duration;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 验证码服务实现
 *
 * @author ding.shichen
 */
@Service
public class CaptchaServiceImpl implements CaptchaService {

    /**
     * 验证码 Redis key 前缀
     */
    private static final String CAPTCHA_KEY_PREFIX = "captcha:";

    /**
     * 验证码过期时间（分钟）
     */
    private static final long CAPTCHA_EXPIRE_MINUTES = 5L;

    @Autowired
    private RedissonClient redissonClient;

    @Override
    public CaptchaDetail generateCaptcha() {
        // 创建线段干扰验证码，宽200，高100，4位字符，50条干扰线
        LineCaptcha captcha = CaptchaUtil.createLineCaptcha(200, 100, 4, 50);
        String code = captcha.getCode();

        // 生成验证码ID
        String captchaId = IdUtil.fastSimpleUUID();

        // 将验证码存储到 Redis 中，设置过期时间为 5 分钟
        String captchaKey = CAPTCHA_KEY_PREFIX + captchaId;
        redissonClient.getBucket(captchaKey).set(code, Duration.ofMinutes(CAPTCHA_EXPIRE_MINUTES));

        // 将验证码图片转换为 Base64
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        captcha.write(outputStream);
        String captchaImage = "data:image/png;base64," + Base64.encode(outputStream.toByteArray());

        CaptchaDetail detail = new CaptchaDetail();
        detail.setCaptchaId(captchaId);
        detail.setCaptchaImage(captchaImage);
        return detail;
    }

    @Override
    public ValidateResult validateCaptcha(String captchaId, String captcha) {
        String captchaKey = CAPTCHA_KEY_PREFIX + captchaId;
        RBucket<String> bucket = redissonClient.getBucket(captchaKey);
        String cachedCode = bucket.get();

        if (StrUtil.isBlank(cachedCode)) {
            return ValidateResult.EXPIRED;
        }

        if (!cachedCode.equalsIgnoreCase(captcha)) {
            // 验证失败后删除验证码，防止重试
            bucket.delete();
            return ValidateResult.ERROR;
        }

        // 验证成功后删除验证码
        bucket.delete();
        return ValidateResult.SUCCESS;
    }
}

