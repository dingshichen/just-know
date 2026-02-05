package cn.dsc.jk.consts;

import lombok.Getter;

/**
 * 系统配置枚举：固定 key 与描述，用于初始化与展示。
 *
 * @author ding.shichen
 */
@Getter
public enum SystemConfigKey {

    /** 用户初始密码 */
    USER_INITIAL_PASSWORD(
            "user.initial.password",
            "用户初始密码",
            "新用户创建时的初始密码"),

    /** 首次登录是否强制修改密码 */
    USER_FORCE_CHANGE_PASSWORD_ON_FIRST_LOGIN(
            "user.force_change_password_on_first_login",
            "首次登录是否强制修改密码",
            "true 表示强制修改，false 表示不强制"),

    /** 密码器选择（Spring Security） */
    PASSWORD_ENCODER(
            "security.password_encoder",
            "密码器",
            "可选：bcrypt、pbkdf2、scrypt、argon2、noop（与 Spring Security DelegatingPasswordEncoder 一致）"),

    /** 用户登录过期时间（小时） */
    USER_LOGIN_EXPIRE_HOURS(
            "user.login.expire_hours",
            "用户登录过期时间",
            "单位：小时，JWT 或会话过期时间"),

    /** 是否允许同一账号多端同时在线 */
    USER_LOGIN_ALLOW_MULTI_CLIENT(
            "user.login.allow_multi_client",
            "是否允许多端在线",
            "true 表示允许同一账号多端同时在线，false 表示仅保留最新会话，其它会话强制下线"),

    /** 是否允许线上操作权限定义 */
    PERMISSION_ALLOW_ONLINE_OPERATION(
            "permission.allow_online_operation",
            "是否允许线上操作权限定义",
            "true 表示允许在权限定义菜单操作权限定义，false 表示仅可查看不可操作");

    private final String key;
    private final String configName;
    private final String configDesc;

    SystemConfigKey(String key, String configName, String configDesc) {
        this.key = key;
        this.configName = configName;
        this.configDesc = configDesc;
    }

    /**
     * 根据 configKey 字符串解析枚举，不存在则返回 null
     */
    public static SystemConfigKey fromKey(String configKey) {
        if (configKey == null || configKey.isBlank()) {
            return null;
        }
        for (SystemConfigKey e : values()) {
            if (e.getKey().equals(configKey)) {
                return e;
            }
        }
        return null;
    }
}
