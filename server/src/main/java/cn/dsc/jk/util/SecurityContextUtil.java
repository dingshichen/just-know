package cn.dsc.jk.util;

import cn.dsc.jk.dto.user.UserSimpleDetail;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * @author ding.shichen
 */
public abstract class SecurityContextUtil {

    public static UserSimpleDetail getUser() {
        return (UserSimpleDetail) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static Long getUserId() {
        return getUser().getUserId();
    }

}
