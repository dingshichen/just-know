package cn.dsc.jk.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 用户机构关系表实体
 *
 * @author ding.shichen
 */
@Data
@TableName("user_dept_rel")
public class UserDeptRelEntity {

    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 机构ID
     */
    @TableField("dept_id")
    private Long deptId;
}
