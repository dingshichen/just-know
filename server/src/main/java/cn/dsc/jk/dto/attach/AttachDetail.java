package cn.dsc.jk.dto.attach;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 附件详情DTO（用于UI详情页展示）
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AttachDetail extends AttachItem {

    /**
     * 附件KEY
     */
    private String attachKey;

    /**
     * 创建用户ID
     */
    private Long createdUserId;

    /**
     * 更新用户ID
     */
    private Long updatedUserId;
}
