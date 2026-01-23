package cn.dsc.jk.dto.role;

import lombok.Data;

/**
 * 修改角色请求DTO
 *
 * @author ding.shichen
 */
@Data
public class RoleUpdate {

    /**
     * 角色名称
     */
    private String roleName;

    /**
     * 角色编码
     */
    private String roleCode;

    /**
     * 角色描述
     */
    private String roleDesc;
}
