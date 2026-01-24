package cn.dsc.jk.service;

import cn.dsc.jk.dto.systemconfig.SystemConfigItem;
import cn.dsc.jk.entity.SystemConfigEntity;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * 系统配置服务接口
 * <p>
 * 系统配置数据为初始化数据，仅支持：查询所有、根据 configKey 修改 configValue。
 * </p>
 *
 * @author ding.shichen
 */
public interface SystemConfigService extends IService<SystemConfigEntity> {

    /**
     * 查询所有系统配置
     *
     * @return 配置列表
     */
    List<SystemConfigItem> listAll();

    /**
     * 根据 configKey 修改 configValue
     *
     * @param configKey  配置键
     * @param configValue 配置值
     */
    void updateValueByKey(String configKey, String configValue);
}
