package cn.dsc.jk.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户表实体
 *
 * @author ding.shichen
 */
@Data
@TableName("user")
public class UserEntity {

    /**
     * 用户ID
     */
    @TableId(value = "user_id", type = IdType.ASSIGN_ID)
    private Long userId;

    /**
     * 用户姓名
     */
    @TableField("user_name")
    private String userName;

    /**
     * 头像附件ID
     */
    @TableField("avatar_attach_id")
    private Long avatarAttachId;

    /**
     * 账号
     */
    @TableField("account")
    private String account;

    /**
     * 性别
     */
    @TableField("gender")
    private String gender;

    /**
     * 手机号码
     */
    @TableField("phone")
    private String phone;

    /**
     * 电子邮箱
     */
    @TableField("email")
    private String email;

    /**
     * 锁定标志
     */
    @TableField("locked_flag")
    private Boolean lockedFlag;

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
