package cn.dsc.jk.dto.permission;

import cn.dsc.jk.common.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 权限分页查询DTO
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PermissionPageQuery extends PageQuery {

    /**
     * 权限名称（模糊查询）
     */
    private String permissionName;

    /**
     * 权限编码（模糊查询）
     */
    private String permissionCode;
}
