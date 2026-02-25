package cn.dsc.jk.dto.role;

import cn.dsc.jk.dto.user.UserOption;
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
     * 创建用户
     */
    private UserOption createdUser;

    /**
     * 更新用户
     */
    private UserOption updatedUser;
}
