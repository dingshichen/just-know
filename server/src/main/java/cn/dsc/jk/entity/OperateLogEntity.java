package cn.dsc.jk.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 操作日志表实体
 *
 * @author ding.shichen
 */
@Data
@TableName("operate_log")
public class OperateLogEntity {

    /**
     * 日志ID
     */
    @TableId(value = "log_id", type = IdType.ASSIGN_ID)
    private Long logId;

    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;

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
     * 操作模块（菜单中文名称）
     */
    @TableField("ops_module")
    private String opsModule;

    /**
     * 操作名称（按钮或API中文名称）
     */
    @TableField("ops_name")
    private String opsName;

    /**
     * 消耗时间，单位：毫秒
     */
    @TableField("cost_time")
    private Long costTime;

    /**
     * 创建时间
     */
    @TableField(value = "created_time", fill = FieldFill.INSERT)
    private LocalDateTime createdTime;
}

