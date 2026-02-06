package cn.dsc.jk.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 公告阅读表实体
 *
 * @author ding.shichen
 */
@Data
@TableName("notice_read")
public class NoticeReadEntity {

    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 公告ID
     */
    @TableField("notice_id")
    private Long noticeId;
}

