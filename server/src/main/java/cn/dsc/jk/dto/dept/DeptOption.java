package cn.dsc.jk.dto.dept;

import cn.dsc.jk.common.IBase;
import lombok.Data;

import java.beans.Transient;
import java.io.Serial;
import java.io.Serializable;

/**
 * 机构选项DTO（用于UI标签、下拉选项）
 *
 * @author ding.shichen
 */
@Data
public class DeptOption implements IBase, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 机构ID
     */
    private Long deptId;

    /**
     * 机构名称
     */
    private String deptName;

    @Transient
    @Override
    public Long getId() {
        return this.deptId;
    }
}
