package cn.dsc.jk.dto.log;

import cn.dsc.jk.common.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 登录日志分页查询 DTO
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class LoginLogPageQuery extends PageQuery {

    /**
     * 登录账号（模糊查询）
     */
    private String loginAccount;

    /**
     * 登录动作类型（枚举名）
     */
    private String loginActionType;

    /**
     * 开始时间
     */
    private LocalDateTime startTime;

    /**
     * 结束时间
     */
    private LocalDateTime endTime;
}

