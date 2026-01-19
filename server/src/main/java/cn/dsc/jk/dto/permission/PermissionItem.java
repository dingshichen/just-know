package cn.dsc.jk.dto.permission;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 权限列表项DTO（用于UI表格、列表）
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PermissionItem extends PermissionOption {

    /**
     * 权限编码
     */
    private String permissionCode;

    /**
     * 创建时间
     */
    private LocalDateTime createdTime;

    /**
     * 更新时间
     */
    private LocalDateTime updatedTime;
}
