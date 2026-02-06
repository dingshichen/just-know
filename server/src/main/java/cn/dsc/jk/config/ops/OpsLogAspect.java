package cn.dsc.jk.config.ops;

import cn.dsc.jk.service.OperateLogService;
import cn.dsc.jk.util.SecurityContextUtil;
import cn.dsc.jk.util.WebUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * 操作日志切面
 *
 * @author ding.shichen
 */
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class OpsLogAspect {

    private final OperateLogService operateLogService;

    @Around("@annotation(opsLog)")
    public Object around(ProceedingJoinPoint joinPoint, OpsLog opsLog) throws Throwable {
        long start = System.currentTimeMillis();
        Object result;

        try {
            result = joinPoint.proceed();
        } catch (Throwable t) {
            throw t;
        } finally {
            try {
                record(opsLog, System.currentTimeMillis() - start);
            } catch (Exception e) {
                log.warn("记录操作日志失败", e);
            }
        }

        return result;
    }

    private void record(OpsLog opsLog, long costTime) {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return;
        }
        HttpServletRequest request = attrs.getRequest();

        Long userId = null;
        try {
            userId = SecurityContextUtil.getUserId();
        } catch (Exception ignore) {
        }

        String userAgent = request.getHeader("User-Agent");
        String ip = WebUtils.getClientIp(request);
        String device = WebUtils.parseDevice(userAgent);
        String browser = WebUtils.parseBrowser(userAgent);

        operateLogService.create(
                userId,
                ip,
                browser,
                device,
                opsLog.module(),
                opsLog.name(),
                costTime
        );
    }
}