package cn.dsc.jk.dto.role;

import java.beans.Transient;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

import cn.dsc.jk.common.IBase;

/**
 * 角色选项DTO（用于UI标签、下拉选项）
 *
 * @author ding.shichen
 */
@Data
public class RoleOption implements IBase, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 角色ID
     */
    private Long roleId;

    /**
     * 角色名称
     */
    private String roleName;

    @Transient
    @Override
    public Long getId() {
        return roleId;
    }
}
