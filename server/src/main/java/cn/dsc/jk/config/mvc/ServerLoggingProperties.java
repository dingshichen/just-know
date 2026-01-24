package cn.dsc.jk.config.mvc;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/**
 * 请求/响应日志打印配置
 *
 * @author ding.shichen
 */
@Data
@ConfigurationProperties(prefix = "jk.logging")
public class ServerLoggingProperties {

    /**
     * 不打印入参的 path 集合（支持 Ant 风格，如 /api/attach/download/*）
     * 默认：登录、attach 上传
     */
    private List<String> noPrintInputPaths = List.of(
            "/api/login/password",
            "/api/attach"
    );

    /**
     * 不打印返回参的 path 集合（支持 Ant 风格）
     * 默认：获取验证码、attach 下载
     */
    private List<String> noPrintResultPaths = List.of(
            "/api/captcha",
            "/api/attach/download/*"
    );
}
