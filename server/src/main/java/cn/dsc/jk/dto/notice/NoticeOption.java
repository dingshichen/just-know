package cn.dsc.jk.dto.notice;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 公告选项DTO（用于UI标签、下拉选项）
 *
 * @author ding.shichen
 */
@Data
public class NoticeOption implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 公告ID
     */
    private Long noticeId;

    /**
     * 标题
     */
    private String title;
}

