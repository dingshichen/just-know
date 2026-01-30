package cn.dsc.jk.dto.login;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 登录会话信息DTO
 * 存储用户登录时的设备、IP、浏览器等信息
 *
 * @author ding.shichen
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginSessionInfo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 设备信息（操作系统）
     */
    private String device;

    /**
     * IP地址
     */
    private String ip;

    /**
     * 浏览器信息
     */
    private String browser;

    /**
     * 登录时间
     */
    private LocalDateTime loginTime;

    /**
     * Token值
     */
    private String token;
}
