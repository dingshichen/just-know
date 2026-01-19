package cn.dsc.jk.dto.menu;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 菜单列表项DTO（用于UI表格、列表）
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MenuItem extends MenuOption {

    /**
     * 菜单类型
     */
    private String menuType;

    /**
     * 菜单文件名称
     */
    private String menuFileName;

    /**
     * 菜单ICON
     */
    private String menuIcon;

    /**
     * 菜单路由
     */
    private String menuRoute;

    /**
     * 权限ID
     */
    private Long permissionId;

    /**
     * 父级菜单ID
     */
    private Long parentMenuId;

    /**
     * 创建时间
     */
    private LocalDateTime createdTime;

    /**
     * 更新时间
     */
    private LocalDateTime updatedTime;
}
