package cn.dsc.jk.service;

import cn.dsc.jk.dto.systemconfig.SystemConfigItem;
import cn.dsc.jk.entity.SystemConfigEntity;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * 系统配置服务接口
 * <p>
 * 系统配置数据为初始化数据，仅支持：查询所有、根据 configKey 修改 configValue。
 * 配置值会缓存到内存中，每 3 分钟自动刷新。
 * </p>
 *
 * @author ding.shichen
 */
public interface SystemConfigService extends IService<SystemConfigEntity> {

    /**
     * 查询所有系统配置
     *
     * @return 配置列表
     */
    List<SystemConfigItem> listAll();

    /**
     * 根据 configKey 修改 configValue
     *
     * @param configKey  配置键
     * @param configValue 配置值
     */
    void updateValueByKey(String configKey, String configValue);

    // ============ 各配置项的 getValue 方法 ============

    /**
     * 获取用户初始密码
     *
     * @return 用户初始密码，如果未配置则返回 null
     */
    String getUserInitialPassword();

    /**
     * 首次登录是否强制修改密码
     *
     * @return true 表示强制修改，false 表示不强制，默认 false
     */
    boolean isForceChangePasswordOnFirstLogin();

    /**
     * 获取密码器类型
     *
     * @return 密码器类型（bcrypt、pbkdf2、scrypt、argon2、noop），默认 bcrypt
     */
    String getPasswordEncoder();

    /**
     * 获取用户登录过期时间（小时）
     *
     * @return 登录过期时间（小时），默认 168（7天）
     */
    int getUserLoginExpireHours();

    /**
     * 获取用户登录过期时间（毫秒）
     *
     * @return 登录过期时间（毫秒）
     */
    long getUserLoginExpireMillis();

    /**
     * 刷新内存中的配置缓存
     */
    void refreshCache();
}
