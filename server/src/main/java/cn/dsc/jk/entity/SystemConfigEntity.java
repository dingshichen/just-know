package cn.dsc.jk.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 系统配置表实体
 *
 * @author ding.shichen
 */
@Data
@TableName("system_config")
public class SystemConfigEntity {

    /**
     * 配置ID
     */
    @TableId(value = "config_id", type = IdType.ASSIGN_ID)
    private Long configId;

    /**
     * 配置名称
     */
    @TableField("config_name")
    private String configName;

    /**
     * 配置键
     */
    @TableField("config_key")
    private String configKey;

    /**
     * 配置值
     */
    @TableField("config_value")
    private String configValue;

    /**
     * 配置描述
     */
    @TableField("config_desc")
    private String configDesc;

    /**
     * 创建用户ID
     */
    @TableField(value = "created_user_id", fill = FieldFill.INSERT)
    private Long createdUserId;

    /**
     * 更新用户ID
     */
    @TableField(value = "updated_user_id", fill = FieldFill.INSERT_UPDATE)
    private Long updatedUserId;

    /**
     * 创建时间
     */
    @TableField(value = "created_time", fill = FieldFill.INSERT)
    private LocalDateTime createdTime;

    /**
     * 更新时间
     */
    @TableField(value = "updated_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedTime;
}
