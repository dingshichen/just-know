package cn.dsc.jk.config.security;

import cn.dsc.jk.dto.user.UserSimpleDetail;
import cn.hutool.core.util.StrUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * 会话认证过滤器：从请求中解析 Token 并从 Redis 获取用户信息写入 SecurityContext
 *
 * @author ding.shichen
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SessionAuthenticationTokenFilter extends OncePerRequestFilter {

    private final SessionTokenContext sessionTokenContext;

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String uri = request.getRequestURI();
        // 注意：当前项目配置了 spring.mvc.servlet.path=/api，因此这里的 uri 通常以 /api 开头
        return uri.startsWith("/api/login/password")
                || uri.startsWith("/api/register")
                || uri.startsWith("/api/captcha");
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 已有认证信息则直接放行
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = resolveToken(request);
        if (StrUtil.isBlank(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 从 Redis 获取用户信息
        UserSimpleDetail userDetail = sessionTokenContext.getUserDetail(token);
        if (userDetail == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 刷新 Token 过期时间（滑动过期）
        sessionTokenContext.refreshToken(token);

        // principal 直接放 userId，便于 SecurityContextUtil.getUserId() 使用
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetail.getUserId(),
                null,
                userDetail.getAuthorities()
        );
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    /**
     * 解析 token
     * 1) Authorization: Bearer <token>
     * 2) Query param: token
     * 
     * @param request
     * @return
     */
    private @Nullable String resolveToken(HttpServletRequest request) {
        // 1) Authorization: Bearer <token>
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StrUtil.isNotBlank(authHeader) && StrUtil.startWithIgnoreCase(authHeader, "Bearer ")) {
            return StrUtil.trim(authHeader.substring(7));
        }

        // 2) Query param: token（前端拼接 ?token=xxx）
        String tokenParam = request.getParameter("token");
        if (StrUtil.isNotBlank(tokenParam)) {
            return StrUtil.trim(tokenParam);
        }

        return null;
    }
}
