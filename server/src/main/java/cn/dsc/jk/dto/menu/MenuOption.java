package cn.dsc.jk.dto.menu;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 菜单选项DTO（用于UI标签、下拉选项）
 *
 * @author ding.shichen
 */
@Data
public class MenuOption implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 菜单ID
     */
    private Long menuId;

    /**
     * 菜单名称
     */
    private String menuName;
}
