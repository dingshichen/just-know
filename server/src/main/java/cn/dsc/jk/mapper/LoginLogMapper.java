package cn.dsc.jk.mapper;

import cn.dsc.jk.entity.LoginLogEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 登录日志 Mapper 接口
 *
 * @author ding.shichen
 */
@Mapper
public interface LoginLogMapper extends BaseMapper<LoginLogEntity> {

    /**
     * 分页查询列表
     *
     * @param loginAccount    登录账号（模糊）
     * @param loginActionType 登录动作类型（枚举名）
     * @param startTime       开始时间
     * @param endTime         结束时间
     * @return 日志列表
     */
    List<LoginLogEntity> selectList(@Param("loginAccount") String loginAccount,
                                    @Param("loginActionType") String loginActionType,
                                    @Param("startTime") LocalDateTime startTime,
                                    @Param("endTime") LocalDateTime endTime);
}

