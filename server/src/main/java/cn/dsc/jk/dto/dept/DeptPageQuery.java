package cn.dsc.jk.dto.dept;

import cn.dsc.jk.common.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 机构分页查询DTO
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class DeptPageQuery extends PageQuery {

    /**
     * 机构名称（模糊查询）
     */
    private String deptName;

    /**
     * 机构编码（模糊查询）
     */
    private String deptCode;

    /**
     * 父级机构ID（精确查询）
     */
    private Long parentDeptId;
}
