package cn.dsc.jk.dto.permission;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 权限详情DTO（用于UI详情页展示）
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PermissionDetail extends PermissionItem {

    /**
     * 创建用户ID
     */
    private Long createdUserId;

    /**
     * 更新用户ID
     */
    private Long updatedUserId;
}
