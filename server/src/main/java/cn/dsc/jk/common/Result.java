package cn.dsc.jk.common;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author ding.shichen
 */
@Data
public class Result<T> implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 错误码
     */
    private int code;

    /**
     * 提示信息
     */
    private String msg;

    /**
     * 具体内容
     */
    private T data;


    public static <T> Result<T> success() {
        return success(null);
    }

    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(ResultCode.SUCCESS.code);
        result.setMsg(ResultCode.SUCCESS.msg);
        result.setData(data);
        return result;
    }

    public static <T> Result<T> error(ResultCode resultCode) {
        return error(resultCode.code, resultCode.msg);
    }

    public static <T> Result<T> error(ResultCode resultCode, String msg) {
        return error(resultCode.code, msg);
    }

    public static <T> Result<T> error(int code, String msg) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMsg(msg);
        result.setData(null);
        return result;
    }
}
