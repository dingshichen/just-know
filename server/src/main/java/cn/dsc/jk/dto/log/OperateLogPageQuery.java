package cn.dsc.jk.dto.log;

import cn.dsc.jk.common.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 操作日志分页查询 DTO
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class OperateLogPageQuery extends PageQuery {

    /**
     * 操作模块（模糊查询）
     */
    private String opsModule;

    /**
     * 操作名称（模糊查询）
     */
    private String opsName;

    /**
     * 开始时间
     */
    private LocalDateTime startTime;

    /**
     * 结束时间
     */
    private LocalDateTime endTime;
}

