package cn.dsc.jk.config.security;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.LdapShaPasswordEncoder;
import org.springframework.security.crypto.password.Md4PasswordEncoder;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;

import cn.dsc.jk.service.SystemConfigService;
import lombok.extern.slf4j.Slf4j;

/**
 * 可配置的密码器
 * <p>
 * 根据系统配置（{@link SystemConfigService#getPasswordEncoder()}）动态选择密码器进行编码，
 * 同时兼容所有 Spring Security 密码格式的匹配（通过 {@link DelegatingPasswordEncoder}）。
 * </p>
 * <p>
 * 支持的密码器与 {@link org.springframework.security.crypto.factory.PasswordEncoderFactories} 完全一致。
 * </p>
 *
 * @author ding.shichen
 */
@Slf4j
@SuppressWarnings("deprecation")
public class ConfigurablePasswordEncoder implements PasswordEncoder {

    private final Map<String, PasswordEncoder> encoders;
    private final DelegatingPasswordEncoder delegatingEncoder;
    private final SystemConfigService systemConfigService;

    public ConfigurablePasswordEncoder(SystemConfigService systemConfigService) {
        this.systemConfigService = systemConfigService;

        // 与 PasswordEncoderFactories.createDelegatingPasswordEncoder() 保持一致
        this.encoders = new HashMap<>();
        encoders.put("bcrypt", new BCryptPasswordEncoder());
        encoders.put("ldap", new LdapShaPasswordEncoder());
        encoders.put("MD4", new Md4PasswordEncoder());
        encoders.put("MD5", new MessageDigestPasswordEncoder("MD5"));
        encoders.put("noop", NoOpPasswordEncoder.getInstance());
        encoders.put("pbkdf2", Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_5());
        encoders.put("pbkdf2@SpringSecurity_v5_8", Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8());
        encoders.put("scrypt", SCryptPasswordEncoder.defaultsForSpringSecurity_v4_1());
        encoders.put("scrypt@SpringSecurity_v5_8", SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8());
        encoders.put("SHA-1", new MessageDigestPasswordEncoder("SHA-1"));
        encoders.put("SHA-256", new MessageDigestPasswordEncoder("SHA-256"));
        encoders.put("sha256", new StandardPasswordEncoder());
        encoders.put("argon2", Argon2PasswordEncoder.defaultsForSpringSecurity_v5_2());
        encoders.put("argon2@SpringSecurity_v5_8", Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8());

        // 默认使用 bcrypt 作为 DelegatingPasswordEncoder 的 fallback，仅用于 matches()
        this.delegatingEncoder = new DelegatingPasswordEncoder("bcrypt", encoders);

        log.info("可配置密码器初始化完成，支持 {} 种密码器", encoders.size());
    }

    /**
     * 根据系统配置的密码器类型对密码进行编码，编码后附带 {id} 前缀。
     */
    @Override
    public String encode(CharSequence rawPassword) {
        String encoderType = systemConfigService.getPasswordEncoder();
        PasswordEncoder encoder = encoders.get(encoderType);
        if (encoder == null) {
            throw new IllegalArgumentException("不支持的密码器类型: " + encoderType);
        }
        return "{" + encoderType + "}" + encoder.encode(rawPassword);
    }

    /**
     * 通过 DelegatingPasswordEncoder 匹配密码，兼容所有 {id} 前缀格式。
     */
    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return delegatingEncoder.matches(rawPassword, encodedPassword);
    }

    /**
     * 判断已编码密码是否需要升级到当前配置的密码器。
     * <p>
     * 如果已编码密码使用的密码器与当前配置不一致，则返回 true 表示需要升级。
     * </p>
     */
    @Override
    public boolean upgradeEncoding(String encodedPassword) {
        if (encodedPassword == null || encodedPassword.isEmpty()) {
            return false;
        }
        String encoderType = systemConfigService.getPasswordEncoder();
        String prefix = "{" + encoderType + "}";
        if (!encodedPassword.startsWith(prefix)) {
            // 密码器类型不一致，需要升级
            return true;
        }
        // 密码器类型一致，委托给具体密码器判断是否需要升级
        String encodedWithoutPrefix = encodedPassword.substring(prefix.length());
        PasswordEncoder encoder = encoders.get(encoderType);
        return encoder != null && encoder.upgradeEncoding(encodedWithoutPrefix);
    }
}
