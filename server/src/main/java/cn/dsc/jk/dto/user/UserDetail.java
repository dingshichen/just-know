package cn.dsc.jk.dto.user;

import cn.dsc.jk.dto.login.LoginSessionInfo;
import cn.dsc.jk.dto.role.RoleOption;
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
     * 头像附件ID
     */
    private Long avatarAttachId;

    /**
     * 创建用户ID
     */
    private Long createdUserId;

    /**
     * 更新用户ID
     */
    private Long updatedUserId;

    /**
     * 是否锁定标志
     */
    private Boolean isLockFlag;

    /**
     * 用户角色列表
     */
    private List<RoleOption> roles;

    /**
     * 是否在线
     */
    private Boolean online;

    /**
     * 登录会话信息列表（设备、IP、浏览器等）
     */
    private List<LoginSessionInfo> loginSessions;

}
