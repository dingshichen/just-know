package cn.dsc.jk.dto.systemconfig;

import java.util.function.Function;

import org.springframework.beans.BeanUtils;

import cn.dsc.jk.entity.SystemConfigEntity;

/**
 * 系统配置转换工具
 *
 * @author ding.shichen
 */
public abstract class SystemConfigConvert {

    public static Function<SystemConfigEntity, SystemConfigItem> FU_TO_ITEM = entity -> {
        if (entity == null) {
            return null;
        }
        SystemConfigItem item = new SystemConfigItem();
        BeanUtils.copyProperties(entity, item);
        return item;
    };
}

