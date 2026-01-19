package cn.dsc.jk.dto.permission;

import lombok.Data;

/**
 * 新增权限请求DTO
 *
 * @author ding.shichen
 */
@Data
public class PermissionCreate {

    /**
     * 权限名称
     */
    private String permissionName;

    /**
     * 权限编码
     */
    private String permissionCode;
}
