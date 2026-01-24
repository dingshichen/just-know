package cn.dsc.jk.control;

import cn.dsc.jk.common.Result;
import cn.dsc.jk.dto.systemconfig.SystemConfigItem;
import cn.dsc.jk.dto.systemconfig.SystemConfigValueUpdate;
import cn.dsc.jk.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 系统配置控制器
 * <p>
 * 系统配置数据为初始化数据，仅支持：查询所有、根据 configKey 修改 configValue。
 * </p>
 *
 * @author ding.shichen
 */
@RestController
@RequestMapping("/system-config")
@RequiredArgsConstructor
public class SystemConfigController {

    private final SystemConfigService systemConfigService;

    /**
     * 查询所有系统配置
     *
     * @return 配置列表
     */
    @GetMapping
    public Result<List<SystemConfigItem>> listAll() {
        List<SystemConfigItem> list = systemConfigService.listAll();
        return Result.success(list);
    }

    /**
     * 根据 configKey 修改 configValue
     *
     * @param update 含 configKey、configValue
     * @return 操作结果
     */
    @PutMapping("/value")
    public Result<?> updateValue(@RequestBody SystemConfigValueUpdate update) {
        systemConfigService.updateValueByKey(update.getConfigKey(), update.getConfigValue());
        return Result.success();
    }
}
