package cn.dsc.jk.dto.role;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 角色详情DTO（用于UI详情页展示）
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class RoleDetail extends RoleItem {

    /**
     * 创建用户ID
     */
    private Long createdUserId;

    /**
     * 更新用户ID
     */
    private Long updatedUserId;
}
