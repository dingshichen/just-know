package cn.dsc.jk.dto.user;

import cn.dsc.jk.common.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户分页查询DTO
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class UserPageQuery extends PageQuery {

    /**
     * 用户姓名（模糊查询）
     */
    private String userName;

    /**
     * 账号（模糊查询）
     */
    private String account;

    /**
     * 手机号码（模糊查询）
     */
    private String phone;

    /**
     * 电子邮箱（模糊查询）
     */
    private String email;

    /**
     * 锁定标志：0-正常，1-锁定
     */
    private Boolean lockedFlag;
}
