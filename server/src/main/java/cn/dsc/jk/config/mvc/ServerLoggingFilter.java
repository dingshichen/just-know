package cn.dsc.jk.config.mvc;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * 请求/响应出入参日志过滤，支持通过配置排除敏感或过大的入参/返回参打印。
 *
 * @author ding.shichen
 */
@Slf4j
@RequiredArgsConstructor
public class ServerLoggingFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;
    private final ServerLoggingProperties loggingProperties;

    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    @Override
    protected void doFilterInternal(@Nonnull HttpServletRequest request, @Nonnull HttpServletResponse response, @Nonnull FilterChain filterChain) throws ServletException, IOException {
        if (isAsyncDispatch(request)) {
            filterChain.doFilter(request, response);
        } else {
            CachingBufferingRequestWrapper requestWrapper = new CachingBufferingRequestWrapper(request);
            ContentCachingResponseWrapper responseWrapper = wrapResponse(response);
            doFilterWrapped(requestWrapper, responseWrapper, filterChain);
        }
    }

    private void doFilterWrapped(CachingBufferingRequestWrapper request, ContentCachingResponseWrapper response, FilterChain filterChain) throws ServletException, IOException {
        long startTime = System.currentTimeMillis();
        try {
            beforeRequest(request);
            filterChain.doFilter(request, response);
        } finally {
            afterRequest(startTime, request, response);
            response.copyBodyToResponse();
        }
    }

    private static ContentCachingResponseWrapper wrapResponse(HttpServletResponse response) {
        if (response instanceof ContentCachingResponseWrapper) {
            return (ContentCachingResponseWrapper) response;
        } else {
            return new ContentCachingResponseWrapper(response);
        }
    }

    @SneakyThrows
    private void beforeRequest(CachingBufferingRequestWrapper request) {
        boolean skipPrintInput = skipPrintInput(request);
        String param = null;
        String body = null;
        if (!skipPrintInput) {
            if (MapUtil.isNotEmpty(request.getParameterMap())) {
                param = toOneLine(objectMapper.writeValueAsString(request.getParameterMap()));
            }
            if (request.getContentType() != null) {
                body = toOneLine(request.getContextString());
            }
        }
        if (StrUtil.isAllBlank(param, body)) {
            log.info("Start | {} | {}", request.getMethod(), request.getRequestURI());
        } else if (StrUtil.isAllNotBlank(param, body)) {
            log.info("Start | {} | {} | param : {} | body : {}", request.getMethod(), request.getRequestURI(), param, body);
        } else if (StrUtil.isNotBlank(param)) {
            log.info("Start | {} | {} | param : {}", request.getMethod(), request.getRequestURI(), param);
        } else {
            log.info("Start | {} | {} | body : {}", request.getMethod(), request.getRequestURI(), body);
        }
    }

    private void afterRequest(long startTime, CachingBufferingRequestWrapper request, ContentCachingResponseWrapper response) {
        long duration = System.currentTimeMillis() - startTime;
        if (skipPrintResult(request, response)) {
            log.info("End | {} | {} | cost : {} ms | status : {}", request.getMethod(), request.getRequestURI(), duration, response.getStatus());
        } else {
            log.info("End | {} | {} | cost : {} ms | status : {} | result : {}", request.getMethod(), request.getRequestURI(), duration, response.getStatus(), toOneLine(new String(response.getContentAsByteArray(), StandardCharsets.UTF_8)));
        }
    }

    /**
     * 把 json 格式的参数打印出一行样式
     */
    private String toOneLine(@Nullable String str) {
        if (str == null) {
            return StrUtil.EMPTY;
        }
        try {
            return objectMapper.readTree(str).toString();
        } catch (JsonProcessingException e) {
            // ignore
        }
        return str;
    }

    /**
     * 跳过打印请求参数：content-type 为 multipart/octet-stream、或 path 命中 jk.logging.no-print-input-paths
     */
    private boolean skipPrintInput(HttpServletRequest request) {
        String contentType = request.getContentType();
        if (contentType != null && (contentType.contains(MediaType.MULTIPART_FORM_DATA_VALUE)
                || contentType.startsWith("application/octet-stream"))) {
            return true;
        }
        return pathMatches(request.getRequestURI(), loggingProperties.getNoPrintInputPaths());
    }

    /**
     * 跳过打印返回值参数：content-type 为 application/force-download、或 path 命中 jk.logging.no-print-result-paths
     */
    private boolean skipPrintResult(HttpServletRequest request, ContentCachingResponseWrapper response) {
        if ("application/force-download".equals(response.getContentType())) {
            return true;
        }
        return pathMatches(request.getRequestURI(), loggingProperties.getNoPrintResultPaths());
    }

    /**
     * 判断 requestURI 是否匹配任一 Ant 风格 pattern
     */
    private boolean pathMatches(String requestUri, List<String> patterns) {
        if (StrUtil.isBlank(requestUri) || CollUtil.isEmpty(patterns)) {
            return false;
        }
        for (String pattern : patterns) {
            if (StrUtil.isNotBlank(pattern) && PATH_MATCHER.match(pattern.trim(), requestUri)) {
                return true;
            }
        }
        return false;
    }
}
