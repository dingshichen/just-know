package cn.dsc.jk.dto.dept;

import lombok.Data;

/**
 * 新增机构请求DTO
 *
 * @author ding.shichen
 */
@Data
public class DeptCreate {

    /**
     * 机构名称
     */
    private String deptName;

    /**
     * 机构编码
     */
    private String deptCode;

    /**
     * 机构描述
     */
    private String deptDesc;

    /**
     * 父级机构ID
     */
    private Long parentDeptId;

    /**
     * 顺序编号
     */
    private Integer sortNo;
}
