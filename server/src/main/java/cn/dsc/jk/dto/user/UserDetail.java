package cn.dsc.jk.dto.user;

import cn.dsc.jk.dto.login.LoginSessionInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * 用户详情DTO（用于UI详情页展示）
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class UserDetail extends UserItem {

    /**
     * 创建用户ID
     */
    private UserOption createdUser;

    /**
     * 更新用户ID
     */
    private UserOption updatedUser;

    /**
     * 登录会话信息列表（设备、IP、浏览器等）
     */
    private List<LoginSessionInfo> loginSessions;

}
