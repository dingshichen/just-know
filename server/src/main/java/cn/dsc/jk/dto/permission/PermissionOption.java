package cn.dsc.jk.dto.permission;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 权限选项DTO（用于UI标签、下拉选项）
 *
 * @author ding.shichen
 */
@Data
public class PermissionOption implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 权限ID
     */
    private Long permissionId;

    /**
     * 权限名称
     */
    private String permissionName;
}
