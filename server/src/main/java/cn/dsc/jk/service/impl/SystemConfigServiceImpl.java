package cn.dsc.jk.service.impl;

import cn.dsc.jk.dto.systemconfig.SystemConfigConvert;
import cn.dsc.jk.dto.systemconfig.SystemConfigItem;
import cn.dsc.jk.entity.SystemConfigEntity;
import cn.dsc.jk.exception.BizException;
import cn.dsc.jk.mapper.SystemConfigMapper;
import cn.dsc.jk.service.SystemConfigService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 系统配置服务实现类
 *
 * @author ding.shichen
 */
@Service
public class SystemConfigServiceImpl extends ServiceImpl<SystemConfigMapper, SystemConfigEntity> implements SystemConfigService {

    @Override
    public List<SystemConfigItem> listAll() {
        List<SystemConfigEntity> entities = this.list();
        return entities.stream().map(SystemConfigConvert.FU_TO_ITEM).toList();
    }

    @Override
    @Transactional
    public void updateValueByKey(String configKey, String configValue) {
        if (configKey == null || configKey.isBlank()) {
            throw new BizException("配置键不能为空");
        }
        if (configValue == null) {
            throw new BizException("配置值不能为空");
        }
        int rows = this.baseMapper.updateValueByKey(configKey, configValue);
        if (rows == 0) {
            throw new BizException("配置不存在: " + configKey);
        }
    }
}

