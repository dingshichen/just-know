package cn.dsc.jk.dto.menu;

import lombok.Data;

/**
 * 修改菜单请求DTO
 *
 * @author ding.shichen
 */
@Data
public class MenuUpdate {

    /**
     * 菜单名称
     */
    private String menuName;

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
}
