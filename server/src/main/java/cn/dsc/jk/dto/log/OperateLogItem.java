package cn.dsc.jk.dto.log;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 操作日志列表项 DTO（用于 UI 表格、列表）
 *
 * @author ding.shichen
 */
@Data
public class OperateLogItem {

    /**
     * 日志ID
     */
    private Long logId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * IP
     */
    private String ip;

    /**
     * 浏览器
     */
    private String browser;

    /**
     * 操作系统/设备
     */
    private String device;

    /**
     * 操作模块（菜单中文名称）
     */
    private String opsModule;

    /**
     * 操作名称（按钮或 API 中文名称）
     */
    private String opsName;

    /**
     * 消耗时间，单位：毫秒
     */
    private Long costTime;

    /**
     * 创建时间
     */
    private LocalDateTime createdTime;
}

