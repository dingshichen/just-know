package cn.dsc.jk.config.ops;

import java.lang.annotation.*;

/**
 * 操作日志注解
 * 用于标记需要记录操作日志的方法
 *
 * @author ding.shichen
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface OpsLog {

    /**
     * 操作模块（对应菜单中文名称）
     */
    String module();

    /**
     * 操作名称（对应按钮或 API 中文名称）
     */
    String name();
}