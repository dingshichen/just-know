package cn.dsc.jk.dto.menu;

import cn.dsc.jk.common.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 菜单分页查询DTO
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class MenuPageQuery extends PageQuery {

    /**
     * 菜单名称（模糊查询）
     */
    private String menuName;

    /**
     * 菜单类型（精确查询）
     */
    private String menuType;

    /**
     * 父级菜单ID（精确查询）
     */
    private Long parentMenuId;
}
