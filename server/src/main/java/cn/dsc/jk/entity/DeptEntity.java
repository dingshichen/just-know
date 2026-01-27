package cn.dsc.jk.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 机构表实体
 *
 * @author ding.shichen
 */
@Data
@TableName("dept")
public class DeptEntity {

    /**
     * 机构ID
     */
    @TableId(value = "dept_id", type = IdType.ASSIGN_ID)
    private Long deptId;

    /**
     * 机构名称
     */
    @TableField("dept_name")
    private String deptName;

    /**
     * 机构编码
     */
    @TableField("dept_code")
    private String deptCode;

    /**
     * 机构描述
     */
    @TableField("dept_desc")
    private String deptDesc;

    /**
     * 父级机构ID
     */
    @TableField("parent_dept_id")
    private Long parentDeptId;

    /**
     * 顺序编号
     */
    @TableField("sort_no")
    private Integer sortNo;

    /**
     * 创建用户ID
     */
    @TableField(value = "created_user_id", fill = FieldFill.INSERT)
    private Long createdUserId;

    /**
     * 更新用户ID
     */
    @TableField(value = "updated_user_id", fill = FieldFill.INSERT_UPDATE)
    private Long updatedUserId;

    /**
     * 创建时间
     */
    @TableField(value = "created_time", fill = FieldFill.INSERT)
    private LocalDateTime createdTime;

    /**
     * 更新时间
     */
    @TableField(value = "updated_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedTime;
}
