package cn.dsc.jk.dto.notice;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 公告详情DTO（用于UI详情页展示）
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class NoticeDetail extends NoticeItem {

    /**
     * 公告内容
     */
    private String content;

    /**
     * 创建用户ID
     */
    private Long createdUserId;

    /**
     * 修改用户ID
     */
    private Long updatedUserId;
}

