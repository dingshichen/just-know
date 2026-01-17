package cn.dsc.jk.config.mvc;

import cn.dsc.jk.common.Result;
import cn.dsc.jk.common.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author ding.shichen
 */
@Slf4j
@ResponseBody
@ControllerAdvice
public class DefaultExceptionAdvice {

    @ExceptionHandler(Throwable.class)
    public Result<?> defaultException(Throwable e) {
        log.error(e.getMessage(), e);
        if (e instanceof ErrorResponse er) {
            return Result.error(er.getStatusCode().value(), e.getMessage());
        }
        return Result.error(ResultCode.ERROR, e.getMessage());
    }

}
