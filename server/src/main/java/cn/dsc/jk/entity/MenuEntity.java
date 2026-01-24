package cn.dsc.jk.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 菜单表实体
 *
 * @author ding.shichen
 */
@Data
@TableName("menu")
public class MenuEntity {

    /**
     * 菜单ID
     */
    @TableId(value = "menu_id", type = IdType.ASSIGN_ID)
    private Long menuId;

    /**
     * 菜单名称
     */
    @TableField("menu_name")
    private String menuName;

    /**
     * 菜单类型
     */
    @TableField("menu_type")
    private String menuType;

    /**
     * 菜单文件名称
     */
    @TableField("menu_file_name")
    private String menuFileName;

    /**
     * 菜单ICON
     */
    @TableField("menu_icon")
    private String menuIcon;

    /**
     * 菜单路由
     */
    @TableField("menu_route")
    private String menuRoute;

    /**
     * 权限ID
     */
    @TableField("permission_id")
    private Long permissionId;

    /**
     * 父级菜单ID
     */
    @TableField("parent_menu_id")
    private Long parentMenuId;

    /**
     * 创建用户ID
     */
    @TableField(value = "created_user_id", fill = FieldFill.INSERT)
    private Long createdUserId;

    /**
     * 更新用户ID
     */
    @TableField(value = "updated_user_id", fill = FieldFill.INSERT_UPDATE)
    private Long updatedUserId;

    /**
     * 创建时间
     */
    @TableField(value = "created_time", fill = FieldFill.INSERT)
    private LocalDateTime createdTime;

    /**
     * 更新时间
     */
    @TableField(value = "updated_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedTime;
}
