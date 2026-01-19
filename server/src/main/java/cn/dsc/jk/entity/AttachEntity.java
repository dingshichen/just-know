package cn.dsc.jk.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 附件表实体
 *
 * @author ding.shichen
 */
@Data
@TableName("attach")
public class AttachEntity {

    /**
     * 附件ID
     */
    @TableId(value = "attach_id", type = IdType.ASSIGN_ID)
    private Long attachId;

    /**
     * 标题
     */
    @TableField("title")
    private String title;

    /**
     * 存储类型
     */
    @TableField("storage_type")
    private String storageType;

    /**
     * 附件类型（文件扩展名）
     */
    @TableField("attach_type")
    private String attachType;

    /**
     * 附件URL
     */
    @TableField("attach_url")
    private String attachUrl;

    /**
     * 附件KEY
     */
    @TableField("attach_key")
    private String attachKey;

    /**
     * 附件大小(KB)
     */
    @TableField("attach_size")
    private Long attachSize;

    /**
     * 创建用户ID
     */
    @TableField("created_user_id")
    private Long createdUserId;

    /**
     * 更新用户ID
     */
    @TableField("updated_user_id")
    private Long updatedUserId;

    /**
     * 创建时间
     */
    @TableField("created_time")
    private LocalDateTime createdTime;

    /**
     * 更新时间
     */
    @TableField("updated_time")
    private LocalDateTime updatedTime;
}
