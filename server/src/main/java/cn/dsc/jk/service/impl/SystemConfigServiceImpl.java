package cn.dsc.jk.service.impl;

import cn.dsc.jk.consts.SystemConfigKey;
import cn.dsc.jk.dto.systemconfig.SystemConfigConvert;
import cn.dsc.jk.dto.systemconfig.SystemConfigItem;
import cn.dsc.jk.entity.SystemConfigEntity;
import cn.dsc.jk.exception.BizException;
import cn.dsc.jk.mapper.SystemConfigMapper;
import cn.dsc.jk.service.SystemConfigService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 系统配置服务实现类
 * <p>
 * 列表以 {@link SystemConfigKey} 枚举为准，与数据库合并：存在则用库中值，不存在则 configValue 为空。
 * 修改时若库中无该 key 则插入一条。
 * </p>
 *
 * @author ding.shichen
 */
@Service
public class SystemConfigServiceImpl extends ServiceImpl<SystemConfigMapper, SystemConfigEntity> implements SystemConfigService {

    @Override
    public List<SystemConfigItem> listAll() {
        List<SystemConfigEntity> entities = this.list();
        Map<String, SystemConfigEntity> mapByKey = entities.stream()
                .collect(Collectors.toMap(SystemConfigEntity::getConfigKey, e -> e, (a, b) -> a));
        List<SystemConfigItem> result = new ArrayList<>();
        for (SystemConfigKey e : SystemConfigKey.values()) {
            SystemConfigEntity entity = mapByKey.get(e.getKey());
            if (entity != null) {
                result.add(SystemConfigConvert.FU_TO_ITEM.apply(entity));
            } else {
                SystemConfigItem item = new SystemConfigItem();
                item.setConfigKey(e.getKey());
                item.setConfigName(e.getConfigName());
                item.setConfigValue(null);
                item.setConfigDesc(e.getConfigDesc());
                result.add(item);
            }
        }
        return result;
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
        SystemConfigKey enumKey = SystemConfigKey.fromKey(configKey);
        if (enumKey == null) {
            throw new BizException("配置键不在允许范围内: " + configKey);
        }
        SystemConfigEntity entity = this.baseMapper.selectByConfigKey(configKey);
        if (entity != null) {
            int rows = this.baseMapper.updateValueByKey(configKey, configValue);
            if (rows == 0) {
                throw new BizException("更新配置失败: " + configKey);
            }
        } else {
            SystemConfigEntity newEntity = new SystemConfigEntity();
            newEntity.setConfigName(enumKey.getConfigName());
            newEntity.setConfigKey(enumKey.getKey());
            newEntity.setConfigValue(configValue);
            newEntity.setConfigDesc(enumKey.getConfigDesc());
            this.save(newEntity);
        }
    }
}

