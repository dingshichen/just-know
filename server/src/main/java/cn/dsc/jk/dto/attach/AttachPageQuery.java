package cn.dsc.jk.dto.attach;

import cn.dsc.jk.common.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 附件分页查询DTO
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AttachPageQuery extends PageQuery {

    /**
     * 标题（模糊查询）
     */
    private String title;

    /**
     * 存储类型
     */
    private String storageType;

    /**
     * 附件类型
     */
    private String attachType;
}
