package cn.dsc.jk.service;

import cn.dsc.jk.consts.LoginActionType;
import cn.dsc.jk.dto.log.LoginLogItem;
import cn.dsc.jk.dto.log.LoginLogPageQuery;
import cn.dsc.jk.entity.LoginLogEntity;
import com.baomidou.mybatisplus.extension.service.IService;
import com.github.pagehelper.PageInfo;

/**
 * 登录日志服务接口
 *
 * @author ding.shichen
 */
public interface LoginLogService extends IService<LoginLogEntity> {

    /**
     * 记录登录日志
     *
     * @param loginUserId     登录用户ID
     * @param loginAccount    登录账号
     * @param actionType      登录动作类型
     * @param ip              IP
     * @param browser         浏览器
     * @param device          设备/操作系统
     */
    void create(Long loginUserId,
                     String loginAccount,
                     LoginActionType actionType,
                     String ip,
                     String browser,
                     String device);

    /**
     * 分页查询登录日志
     *
     * @param query 查询条件
     * @return 分页结果
     */
    PageInfo<LoginLogItem> page(LoginLogPageQuery query);
}

