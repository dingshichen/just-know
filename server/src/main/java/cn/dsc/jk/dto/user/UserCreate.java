package cn.dsc.jk.dto.user;

import lombok.Data;

import java.util.List;

/**
 * 新增用户请求DTO
 *
 * @author ding.shichen
 */
@Data
public class UserCreate {

    /**
     * 用户姓名
     */
    private String userName;

    /**
     * 头像附件ID
     */
    private Long avatarAttachId;

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
     * 部门ID列表
     */
    private List<Long> deptIds;
}
