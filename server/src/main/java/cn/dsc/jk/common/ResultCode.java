package cn.dsc.jk.common;

import lombok.AllArgsConstructor;

/**
 * @author ding.shichen
 */
@AllArgsConstructor
public enum ResultCode {

    SUCCESS(0, "请求成功"),
    ERROR(-1, "系统错误"),
    LOGIN_FAIL(1001, "登录失败"),
    AUTH_FAIL(1002, "认证失败"),
    PERMISSION_FAIL(1003, "权限不足"),
    LOGIN_LOCKED(1004, "账户被锁定"),

    ;

    public final int code;

    public final String msg;
}
