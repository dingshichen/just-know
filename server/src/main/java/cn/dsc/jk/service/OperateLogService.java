package cn.dsc.jk.service;

import cn.dsc.jk.dto.log.OperateLogItem;
import cn.dsc.jk.dto.log.OperateLogPageQuery;
import cn.dsc.jk.entity.OperateLogEntity;
import com.baomidou.mybatisplus.extension.service.IService;
import com.github.pagehelper.PageInfo;

/**
 * 操作日志服务接口
 *
 * @author ding.shichen
 */
public interface OperateLogService extends IService<OperateLogEntity> {

    /**
     * 记录操作日志
     *
     * @param userId   用户ID
     * @param ip       IP
     * @param browser  浏览器
     * @param device   设备/操作系统
     * @param opsModule 操作模块（菜单中文名称）
     * @param opsName   操作名称（按钮或 API 中文名称）
     * @param costTime  消耗时间，单位：毫秒
     */
    void create(Long userId,
                          String ip,
                          String browser,
                          String device,
                          String opsModule,
                          String opsName,
                          Long costTime);

    /**
     * 分页查询操作日志
     *
     * @param query 查询条件
     * @return 分页结果
     */
    PageInfo<OperateLogItem> page(OperateLogPageQuery query);
}

