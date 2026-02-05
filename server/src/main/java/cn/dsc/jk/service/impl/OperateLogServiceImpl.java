package cn.dsc.jk.service.impl;

import cn.dsc.jk.dto.log.OperateLogItem;
import cn.dsc.jk.dto.log.OperateLogPageQuery;
import cn.dsc.jk.entity.OperateLogEntity;
import cn.dsc.jk.mapper.OperateLogMapper;
import cn.dsc.jk.service.OperateLogService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 操作日志服务实现类
 *
 * @author ding.shichen
 */
@Service
public class OperateLogServiceImpl extends ServiceImpl<OperateLogMapper, OperateLogEntity>
        implements OperateLogService {

    @Override
    public void recordOperateLog(Long userId, String ip, String browser, String device,
                                 String opsModule, String opsName, Long costTime) {
        OperateLogEntity entity = new OperateLogEntity();
        entity.setUserId(userId);
        entity.setIp(ip);
        entity.setBrowser(browser);
        entity.setDevice(device);
        entity.setOpsModule(opsModule);
        entity.setOpsName(opsName);
        entity.setCostTime(costTime);
        this.save(entity);
    }

    @Override
    public PageInfo<OperateLogItem> page(OperateLogPageQuery query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<OperateLogEntity> entities = this.baseMapper.selectList(
                query.getOpsModule(),
                query.getOpsName(),
                query.getStartTime(),
                query.getEndTime()
        );
        List<OperateLogItem> items = entities.stream().map(e -> {
            OperateLogItem item = new OperateLogItem();
            item.setLogId(e.getLogId());
            item.setUserId(e.getUserId());
            item.setIp(e.getIp());
            item.setBrowser(e.getBrowser());
            item.setDevice(e.getDevice());
            item.setOpsModule(e.getOpsModule());
            item.setOpsName(e.getOpsName());
            item.setCostTime(e.getCostTime());
            item.setCreatedTime(e.getCreatedTime());
            return item;
        }).toList();
        return new PageInfo<>(items);
    }
}

