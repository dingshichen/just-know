package cn.dsc.jk.mapper;

import cn.dsc.jk.entity.SystemConfigEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 系统配置Mapper接口
 *
 * @author ding.shichen
 */
@Mapper
public interface SystemConfigMapper extends BaseMapper<SystemConfigEntity> {

    /**
     * 根据配置键更新配置值
     *
     * @param configKey   配置键
     * @param configValue 配置值
     * @return 受影响行数
     */
    int updateValueByKey(@Param("configKey") String configKey, @Param("configValue") String configValue);
}
