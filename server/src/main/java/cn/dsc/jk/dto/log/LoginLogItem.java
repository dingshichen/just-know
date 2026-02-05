package cn.dsc.jk.dto.log;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 登录日志列表项 DTO（用于 UI 表格、列表）
 *
 * @author ding.shichen
 */
@Data
public class LoginLogItem {

    /**
     * 日志ID
     */
    private Long logId;

    /**
     * 登录用户ID
     */
    private Long loginUserId;

    /**
     * 登录账号
     */
    private String loginAccount;

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
     * 登录动作类型
     */
    private String loginActionType;

    /**
     * 创建时间
     */
    private LocalDateTime createdTime;
}

