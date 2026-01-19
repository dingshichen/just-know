package cn.dsc.jk.exception;

/**
 * 业务异常
 * @author ding.shichen
 */
public class BizException extends RuntimeException {

    public BizException(String message) {
        super(message);
    }
}
