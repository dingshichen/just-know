package cn.dsc.jk.util;

import org.springframework.security.core.context.SecurityContextHolder;

/**
 * @author ding.shichen
 */
public abstract class SecurityContextUtil {

    public static Long getUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

}
