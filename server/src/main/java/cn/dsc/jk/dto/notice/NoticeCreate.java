package cn.dsc.jk.dto.notice;

import lombok.Data;

import java.time.LocalDate;

/**
 * 新增公告请求DTO
 *
 * @author ding.shichen
 */
@Data
public class NoticeCreate {

    /**
     * 标题
     */
    private String title;

    /**
     * 内容
     */
    private String content;

    /**
     * 开始日期
     */
    private LocalDate startDate;

    /**
     * 结束日期
     */
    private LocalDate endDate;

    /**
     * 公告状态
     */
    private String noticeStatus;
}

