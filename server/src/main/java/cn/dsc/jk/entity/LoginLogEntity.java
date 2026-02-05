package cn.dsc.jk.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 登录日志表实体
 *
 * @author ding.shichen
 */
@Data
@TableName("login_log")
public class LoginLogEntity {

    /**
     * 日志ID
     */
    @TableId(value = "log_id", type = IdType.ASSIGN_ID)
    private Long logId;

    /**
     * 登录用户ID
     */
    @TableField("login_user_id")
    private Long loginUserId;

    /**
     * 登录账号
     */
    @TableField("login_account")
    private String loginAccount;

    /**
     * IP
     */
    @TableField("ip")
    private String ip;

    /**
     * 浏览器
     */
    @TableField("browser")
    private String browser;

    /**
     * 操作系统/设备
     */
    @TableField("device")
    private String device;

    /**
     * 登录动作类型
     */
    @TableField("login_action_type")
    private String loginActionType;

    /**
     * 创建时间
     */
    @TableField(value = "created_time", fill = FieldFill.INSERT)
    private LocalDateTime createdTime;
}

