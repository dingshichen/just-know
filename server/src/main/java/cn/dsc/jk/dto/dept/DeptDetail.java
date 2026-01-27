package cn.dsc.jk.dto.dept;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 机构详情DTO（用于UI详情页展示）
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class DeptDetail extends DeptItem {

    /**
     * 创建用户ID
     */
    private Long createdUserId;

    /**
     * 更新用户ID
     */
    private Long updatedUserId;
}
