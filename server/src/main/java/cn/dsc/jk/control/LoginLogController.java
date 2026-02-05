package cn.dsc.jk.control;

import cn.dsc.jk.common.Result;
import cn.dsc.jk.dto.log.LoginLogItem;
import cn.dsc.jk.dto.log.LoginLogPageQuery;
import cn.dsc.jk.service.LoginLogService;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 登录日志控制器
 *
 * @author ding.shichen
 */
@RestController
@RequestMapping("/login-log")
@RequiredArgsConstructor
public class LoginLogController {

    private final LoginLogService loginLogService;

    /**
     * 分页查询登录日志列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<PageInfo<LoginLogItem>> page(LoginLogPageQuery query) {
        PageInfo<LoginLogItem> pageInfo = loginLogService.page(query);
        return Result.success(pageInfo);
    }
}

