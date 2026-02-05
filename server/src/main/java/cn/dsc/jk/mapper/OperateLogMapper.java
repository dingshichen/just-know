package cn.dsc.jk.mapper;

import cn.dsc.jk.entity.OperateLogEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 操作日志 Mapper 接口
 *
 * @author ding.shichen
 */
@Mapper
public interface OperateLogMapper extends BaseMapper<OperateLogEntity> {

    /**
     * 分页查询列表
     *
     * @param opsModule 操作模块（模糊）
     * @param opsName   操作名称（模糊）
     * @param startTime 开始时间
     * @param endTime   结束时间
     * @return 日志列表
     */
    List<OperateLogEntity> selectList(@Param("opsModule") String opsModule,
                                      @Param("opsName") String opsName,
                                      @Param("startTime") LocalDateTime startTime,
                                      @Param("endTime") LocalDateTime endTime);
}

