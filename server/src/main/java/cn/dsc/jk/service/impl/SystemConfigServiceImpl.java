package cn.dsc.jk.service.impl;

import cn.dsc.jk.consts.SystemConfigKey;
import cn.dsc.jk.dto.systemconfig.SystemConfigConvert;
import cn.dsc.jk.dto.systemconfig.SystemConfigItem;
import cn.dsc.jk.entity.SystemConfigEntity;
import cn.dsc.jk.exception.BizException;
import cn.dsc.jk.mapper.SystemConfigMapper;
import cn.dsc.jk.service.SystemConfigService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 系统配置服务实现类
 * <p>
 * 列表以 {@link SystemConfigKey} 枚举为准，与数据库合并：存在则用库中值，不存在则 configValue 为空。
 * 修改时若库中无该 key 则插入一条。
 * 配置值缓存到内存中，每 3 分钟自动刷新。
 * 启动时校验所有配置项必须存在且合法，否则启动失败。
 * </p>
 *
 * @author ding.shichen
 */
@Slf4j
@Service
public class SystemConfigServiceImpl extends ServiceImpl<SystemConfigMapper, SystemConfigEntity> implements SystemConfigService {

    /**
     * 内存缓存：configKey -> configValue
     */
    private final Map<String, String> configCache = new ConcurrentHashMap<>();

    /**
     * 合法的密码器列表
     */
    private static final Set<String> VALID_PASSWORD_ENCODERS = Set.of(
            "bcrypt", "pbkdf2", "scrypt", "argon2", "noop"
    );

    /**
     * 应用启动时初始化缓存并校验配置
     */
    @PostConstruct
    public void init() {
        refreshCache();
        validateAllConfigs();
        log.info("系统配置缓存初始化完成，所有配置校验通过");
    }

    /**
     * 校验所有配置项是否存在且合法
     *
     * @throws IllegalStateException 如果配置缺失或不合法
     */
    private void validateAllConfigs() {
        List<String> errors = new ArrayList<>();

        for (SystemConfigKey key : SystemConfigKey.values()) {
            String value = configCache.get(key.getKey());
            String error = validateConfigValue(key, value);
            if (error != null) {
                errors.add(error);
            }
        }

        if (!errors.isEmpty()) {
            String errorMessage = "系统配置校验失败，应用无法启动:\n" + String.join("\n", errors);
            log.error(errorMessage);
            throw new IllegalStateException(errorMessage);
        }
    }

    /**
     * 校验单个配置项的值
     *
     * @param key   配置键枚举
     * @param value 配置值
     * @return 错误信息，如果合法则返回 null
     */
    private String validateConfigValue(SystemConfigKey key, String value) {
        if (value == null || value.isBlank()) {
            return String.format("- [%s] %s: 配置值不能为空", key.getKey(), key.getConfigName());
        }

        switch (key) {
            case USER_INITIAL_PASSWORD:
                return null; // 非空即可
            case USER_FORCE_CHANGE_PASSWORD_ON_FIRST_LOGIN:
            case USER_LOGIN_CAPTCHA:
            case USER_LOGIN_SAVE_LOGIN_FAIL:
            case USER_LOGIN_ALLOW_MULTI_CLIENT:
            case PERMISSION_ALLOW_ONLINE_OPERATION:
                if (!"true".equalsIgnoreCase(value) && !"false".equalsIgnoreCase(value)) {
                    return String.format("- [%s] %s: 值必须为 true 或 false，当前值: %s",
                            key.getKey(), key.getConfigName(), value);
                }
                return null;
            case PASSWORD_ENCODER:
                if (!VALID_PASSWORD_ENCODERS.contains(value.toLowerCase())) {
                    return String.format("- [%s] %s: 值必须为 %s 之一，当前值: %s",
                            key.getKey(), key.getConfigName(), VALID_PASSWORD_ENCODERS, value);
                }
                return null;
            case USER_LOGIN_EXPIRE_HOURS:
                try {
                    int hours = Integer.parseInt(value.trim());
                    if (hours <= 0) {
                        return String.format("- [%s] %s: 值必须为正整数，当前值: %s",
                                key.getKey(), key.getConfigName(), value);
                    }
                } catch (NumberFormatException e) {
                    return String.format("- [%s] %s: 值必须为正整数，当前值: %s",
                            key.getKey(), key.getConfigName(), value);
                }
                return null;
            default:
                return null;
        }
    }

    /**
     * 每 3 分钟刷新缓存
     */
    @Override
    @Scheduled(fixedRate = 3 * 60 * 1000)
    public void refreshCache() {
        try {
            List<SystemConfigEntity> entities = this.list();
            Map<String, String> newCache = entities.stream()
                    .filter(e -> e.getConfigValue() != null)
                    .collect(Collectors.toMap(
                            SystemConfigEntity::getConfigKey,
                            SystemConfigEntity::getConfigValue,
                            (a, b) -> a
                    ));
            configCache.clear();
            configCache.putAll(newCache);
            log.debug("系统配置缓存刷新完成，共 {} 条配置", configCache.size());
        } catch (Exception e) {
            log.error("刷新系统配置缓存失败", e);
        }
    }

    /**
     * 从缓存获取配置值，如果不存在则抛出异常
     *
     * @param key 配置键枚举
     * @return 配置值
     * @throws BizException 如果配置不存在或值不合法
     */
    private String getRequiredValue(SystemConfigKey key) {
        String value = configCache.get(key.getKey());
        String error = validateConfigValue(key, value);
        if (error != null) {
            throw new BizException("系统配置异常: " + key.getConfigName() + "，请检查配置");
        }
        return value;
    }

    @Override
    public List<SystemConfigItem> listAll() {
        List<SystemConfigEntity> entities = this.list();
        Map<String, SystemConfigEntity> mapByKey = entities.stream()
                .collect(Collectors.toMap(SystemConfigEntity::getConfigKey, e -> e, (a, b) -> a));
        List<SystemConfigItem> result = new ArrayList<>();
        for (SystemConfigKey e : SystemConfigKey.values()) {
            SystemConfigEntity entity = mapByKey.get(e.getKey());
            if (entity != null) {
                result.add(SystemConfigConvert.FU_TO_ITEM.apply(entity));
            } else {
                SystemConfigItem item = new SystemConfigItem();
                item.setConfigKey(e.getKey());
                item.setConfigName(e.getConfigName());
                item.setConfigValue(null);
                item.setConfigDesc(e.getConfigDesc());
                result.add(item);
            }
        }
        return result;
    }

    @Override
    @Transactional
    public void updateValueByKey(String configKey, String configValue) {
        if (configKey == null || configKey.isBlank()) {
            throw new BizException("配置键不能为空");
        }
        if (configValue == null || configValue.isBlank()) {
            throw new BizException("配置值不能为空");
        }
        SystemConfigKey enumKey = SystemConfigKey.fromKey(configKey);
        if (enumKey == null) {
            throw new BizException("配置键不在允许范围内: " + configKey);
        }

        // 严格校验配置值的合法性
        String error = validateConfigValue(enumKey, configValue);
        if (error != null) {
            throw new BizException(getValidationErrorMessage(enumKey, configValue));
        }

        SystemConfigEntity entity = this.baseMapper.selectByConfigKey(configKey);
        if (entity != null) {
            int rows = this.baseMapper.updateValueByKey(configKey, configValue);
            if (rows == 0) {
                throw new BizException("更新配置失败: " + configKey);
            }
        } else {
            SystemConfigEntity newEntity = new SystemConfigEntity();
            newEntity.setConfigName(enumKey.getConfigName());
            newEntity.setConfigKey(enumKey.getKey());
            newEntity.setConfigValue(configValue);
            newEntity.setConfigDesc(enumKey.getConfigDesc());
            this.save(newEntity);
        }
        // 更新后立即刷新缓存
        configCache.put(configKey, configValue);
    }

    /**
     * 获取校验错误的友好提示信息
     */
    private String getValidationErrorMessage(SystemConfigKey key, String value) {
        switch (key) {
            case USER_INITIAL_PASSWORD:
                return "用户初始密码不能为空";
            case USER_FORCE_CHANGE_PASSWORD_ON_FIRST_LOGIN:
                return "首次登录是否强制修改密码的值必须为 true 或 false";
            case USER_LOGIN_CAPTCHA:
                return "是否开启验证码登录的值必须为 true 或 false";
            case USER_LOGIN_SAVE_LOGIN_FAIL:
                return "登录失败是否记录登录日志的值必须为 true 或 false";
            case USER_LOGIN_ALLOW_MULTI_CLIENT:
                return "是否允许多端在线的值必须为 true 或 false";
            case PASSWORD_ENCODER:
                return "密码器的值必须为 " + VALID_PASSWORD_ENCODERS + " 之一";
            case USER_LOGIN_EXPIRE_HOURS:
                return "用户登录过期时间必须为正整数（单位：小时）";
            case PERMISSION_ALLOW_ONLINE_OPERATION:
                return "是否允许线上操作权限定义的值必须为 true 或 false";
            default:
                return "配置值不合法";
        }
    }

    // ============ 各配置项的 getValue 方法实现 ============

    @Override
    public String getUserInitialPassword() {
        return getRequiredValue(SystemConfigKey.USER_INITIAL_PASSWORD);
    }

    @Override
    public boolean isForceChangePasswordOnFirstLogin() {
        String value = getRequiredValue(SystemConfigKey.USER_FORCE_CHANGE_PASSWORD_ON_FIRST_LOGIN);
        return "true".equalsIgnoreCase(value);
    }

    @Override
    public String getPasswordEncoder() {
        return getRequiredValue(SystemConfigKey.PASSWORD_ENCODER);
    }

    @Override
    public int getUserLoginExpireHours() {
        String value = getRequiredValue(SystemConfigKey.USER_LOGIN_EXPIRE_HOURS);
        return Integer.parseInt(value.trim());
    }

    @Override
    public long getUserLoginExpireMillis() {
        return (long) getUserLoginExpireHours() * 60 * 60 * 1000;
    }

    @Override
    public boolean isUserLoginCaptchaEnabled() {
        String value = getRequiredValue(SystemConfigKey.USER_LOGIN_CAPTCHA);
        return "true".equalsIgnoreCase(value);
    }

    @Override
    public boolean isSaveLoginFailLogEnabled() {
        String value = getRequiredValue(SystemConfigKey.USER_LOGIN_SAVE_LOGIN_FAIL);
        return "true".equalsIgnoreCase(value);
    }

    @Override
    public boolean isAllowMultiLogin() {
        String value = getRequiredValue(SystemConfigKey.USER_LOGIN_ALLOW_MULTI_CLIENT);
        return "true".equalsIgnoreCase(value);
    }

    @Override
    public boolean isPermissionAllowOnlineOperation() {
        String value = getRequiredValue(SystemConfigKey.PERMISSION_ALLOW_ONLINE_OPERATION);
        return "true".equalsIgnoreCase(value);
    }
}

