package cn.dsc.jk.service.impl;

import cn.dsc.jk.consts.LoginActionType;
import cn.dsc.jk.dto.log.LoginLogItem;
import cn.dsc.jk.dto.log.LoginLogPageQuery;
import cn.dsc.jk.entity.LoginLogEntity;
import cn.dsc.jk.mapper.LoginLogMapper;
import cn.dsc.jk.service.LoginLogService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 登录日志服务实现类
 *
 * @author ding.shichen
 */
@Service
public class LoginLogServiceImpl extends ServiceImpl<LoginLogMapper, LoginLogEntity> implements LoginLogService {

    @Override
    public void create(Long loginUserId, String loginAccount, LoginActionType actionType,
                            String ip, String browser, String device) {
        LoginLogEntity entity = new LoginLogEntity();
        entity.setLoginUserId(loginUserId);
        entity.setLoginAccount(loginAccount);
        entity.setIp(ip);
        entity.setBrowser(browser);
        entity.setDevice(device);
        entity.setLoginActionType(actionType != null ? actionType.name() : null);
        this.save(entity);
    }

    @Override
    public PageInfo<LoginLogItem> page(LoginLogPageQuery query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<LoginLogEntity> entities = this.baseMapper.selectList(
                query.getLoginAccount(),
                query.getLoginActionType(),
                query.getStartTime(),
                query.getEndTime()
        );
        List<LoginLogItem> items = entities.stream().map(e -> {
            LoginLogItem item = new LoginLogItem();
            item.setLogId(e.getLogId());
            item.setLoginUserId(e.getLoginUserId());
            item.setLoginAccount(e.getLoginAccount());
            item.setIp(e.getIp());
            item.setBrowser(e.getBrowser());
            item.setDevice(e.getDevice());
            item.setLoginActionType(e.getLoginActionType());
            item.setCreatedTime(e.getCreatedTime());
            return item;
        }).toList();
        return new PageInfo<>(items);
    }
}

