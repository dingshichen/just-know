package cn.dsc.jk.dto.menu;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 菜单详情DTO（用于UI详情页展示）
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MenuDetail extends MenuItem {

    /**
     * 创建用户ID
     */
    private Long createdUserId;

    /**
     * 更新用户ID
     */
    private Long updatedUserId;
}
