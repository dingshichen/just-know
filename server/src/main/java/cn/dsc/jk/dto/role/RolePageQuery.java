package cn.dsc.jk.dto.role;

import cn.dsc.jk.common.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 角色分页查询DTO
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class RolePageQuery extends PageQuery {

    /**
     * 角色名称（模糊查询）
     */
    private String roleName;

    /**
     * 角色编码（模糊查询）
     */
    private String roleCode;
}
