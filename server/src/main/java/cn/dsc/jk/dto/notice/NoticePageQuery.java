package cn.dsc.jk.dto.notice;

import cn.dsc.jk.common.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 公告分页查询DTO
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class NoticePageQuery extends PageQuery {

    /**
     * 标题（模糊查询）
     */
    private String title;

    /**
     * 公告状态（DRAFT/PUBLISHED）
     */
    private String noticeStatus;
}
