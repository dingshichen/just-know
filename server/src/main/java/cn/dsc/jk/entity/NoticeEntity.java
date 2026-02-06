package cn.dsc.jk.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 公告表实体
 *
 * @author ding.shichen
 */
@Data
@TableName("notice")
public class NoticeEntity {

    /**
     * 公告ID
     */
    @TableId(value = "notice_id", type = IdType.ASSIGN_ID)
    private Long noticeId;

    /**
     * 标题
     */
    @TableField("title")
    private String title;

    /**
     * 内容
     */
    @TableField("content")
    private String content;

    /**
     * 开始日期
     */
    @TableField("start_date")
    private LocalDate startDate;

    /**
     * 结束日期
     */
    @TableField("end_date")
    private LocalDate endDate;

    /**
     * 公告状态（如：草稿、发布、下线）
     */
    @TableField("notice_status")
    private String noticeStatus;

    /**
     * 创建用户ID
     */
    @TableField(value = "created_user_id", fill = FieldFill.INSERT)
    private Long createdUserId;

    /**
     * 修改用户ID
     */
    @TableField(value = "updated_user_id", fill = FieldFill.INSERT_UPDATE)
    private Long updatedUserId;

    /**
     * 创建时间
     */
    @TableField(value = "created_time", fill = FieldFill.INSERT)
    private LocalDateTime createdTime;

    /**
     * 修改时间
     */
    @TableField(value = "updated_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedTime;
}

