package cn.dsc.jk.dto.user;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.List;

import cn.dsc.jk.dto.dept.DeptOption;
import cn.dsc.jk.dto.role.RoleOption;

/**
 * 用户列表项DTO（用于UI表格、列表）
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class UserItem extends UserOption {

    /**
     * 账号
     */
    private String account;

    /**
     * 性别
     */
    private String gender;

    /**
     * 手机号码
     */
    private String phone;

    /**
     * 电子邮箱
     */
    private String email;

    /**
     * 锁定标志：0-正常，1-锁定
     */
    private Integer lockedFlag;

    /**
     * 角色列表
     */
    private List<RoleOption> roles;

    /**
     * 部门列表
     */
    private List<DeptOption> depts;

    /**
     * 创建时间
     */
    private LocalDateTime createdTime;

    /**
     * 更新时间
     */
    private LocalDateTime updatedTime;
}
