package cn.dsc.jk.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户凭证表实体
 *
 * @author ding.shichen
 */
@Data
@TableName("user_credential")
public class UserCredentialEntity {

    /**
     * 用户ID
     */
    @TableId(value = "user_id", type = IdType.INPUT)
    private Long userId;

    /**
     * 密码
     */
    @TableField("password")
    private String password;

    /**
     * 记住我服务
     */
    @TableField("remember_me_service")
    private String rememberMeService;

    /**
     * 记住我令牌
     */
    @TableField("remember_me_token")
    private String rememberMeToken;

    /**
     * 记住我最近使用时间
     */
    @TableField("remember_me_last_used_time")
    private LocalDateTime rememberMeLastUsedTime;
}
