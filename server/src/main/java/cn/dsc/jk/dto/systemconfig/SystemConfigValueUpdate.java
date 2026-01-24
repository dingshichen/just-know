package cn.dsc.jk.dto.systemconfig;

import lombok.Data;

/**
 * 根据 configKey 修改 configValue 的请求 DTO
 *
 * @author ding.shichen
 */
@Data
public class SystemConfigValueUpdate {

    /**
     * 配置键
     */
    private String configKey;

    /**
     * 配置值
     */
    private String configValue;
}
