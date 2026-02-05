package cn.dsc.jk.control;

import cn.dsc.jk.common.Result;
import cn.dsc.jk.dto.log.OperateLogItem;
import cn.dsc.jk.dto.log.OperateLogPageQuery;
import cn.dsc.jk.service.OperateLogService;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 操作日志控制器
 *
 * @author ding.shichen
 */
@RestController
@RequestMapping("/operate-log")
@RequiredArgsConstructor
public class OperateLogController {

    private final OperateLogService operateLogService;

    /**
     * 分页查询操作日志列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<PageInfo<OperateLogItem>> page(OperateLogPageQuery query) {
        PageInfo<OperateLogItem> pageInfo = operateLogService.page(query);
        return Result.success(pageInfo);
    }
}

