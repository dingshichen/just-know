package cn.dsc.jk.dto.dept;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 机构列表项DTO（用于UI表格、列表）
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class DeptItem extends DeptOption {

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

    /**
     * 创建时间
     */
    private LocalDateTime createdTime;

    /**
     * 更新时间
     */
    private LocalDateTime updatedTime;

    /**
     * 子机构列表（用于树形结构）
     */
    private List<DeptItem> children;
}
