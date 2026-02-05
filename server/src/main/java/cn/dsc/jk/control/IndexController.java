package cn.dsc.jk.control;

import cn.dsc.jk.common.Result;
import cn.dsc.jk.common.ResultCode;
import cn.dsc.jk.consts.LoginActionType;
import cn.dsc.jk.config.security.SessionTokenContext;
import cn.dsc.jk.dto.login.CaptchaDetail;
import cn.dsc.jk.dto.login.LoginRequest;
import cn.dsc.jk.dto.login.LoginResponse;
import cn.dsc.jk.dto.user.UserSimpleDetail;
import cn.dsc.jk.service.CaptchaService;
import cn.dsc.jk.service.LoginLogService;
import cn.dsc.jk.consts.ValidateResult;
import cn.dsc.jk.util.WebUtils;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;


/**
 * 首页控制器
 *
 * @author ding.shichen
 */
@Slf4j
@RequiredArgsConstructor
@RestController
public class IndexController {

    private final AuthenticationManager authenticationManager;
    private final CaptchaService captchaService;
    private final SessionTokenContext sessionTokenContext;
    private final LoginLogService loginLogService;

    /**
     * 获取验证码
     *
     * @return 验证码响应
     */
    @GetMapping("/captcha")
    public Result<CaptchaDetail> getCaptcha() {
        return Result.success(captchaService.generateCaptcha());
    }

    /**
     * 账号+密码+验证码登录
     *
     * @param request 登录请求
     * @param httpRequest HTTP请求（用于提取设备、IP、浏览器信息）
     * @return 登录响应
     */
    @PostMapping("/login/password")
    public Result<LoginResponse> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        // 提取客户端信息（IP、设备、浏览器）
        String userAgent = httpRequest.getHeader("User-Agent");
        String ip = WebUtils.getClientIp(httpRequest);
        String device = WebUtils.parseDevice(userAgent);
        String browser = WebUtils.parseBrowser(userAgent);
        // 验证参数
        if (StrUtil.isBlank(request.getUsername()) || StrUtil.isBlank(request.getPassword())) {
            loginLogService.create(null, request.getUsername(), LoginActionType.LOGIN_FAIL, ip, browser, device);
            return Result.error(ResultCode.LOGIN_FAIL, "账号或密码不能为空");
        }
        if (StrUtil.isBlank(request.getCaptcha()) || StrUtil.isBlank(request.getCaptchaId())) {
            loginLogService.create(null, request.getUsername(), LoginActionType.LOGIN_FAIL, ip, browser, device);
            return Result.error(ResultCode.LOGIN_FAIL, "验证码不能为空");
        }

        // 验证验证码
        ValidateResult validateResult = captchaService.validateCaptcha(request.getCaptchaId(), request.getCaptcha());
        if (validateResult == ValidateResult.EXPIRED) {
            loginLogService.create(null, request.getUsername(), LoginActionType.LOGIN_FAIL, ip, browser, device);
            return Result.error(ResultCode.LOGIN_FAIL, "验证码已过期，请重新获取");
        }
        if (validateResult == ValidateResult.ERROR) {
            loginLogService.create(null, request.getUsername(), LoginActionType.LOGIN_FAIL, ip, browser, device);
            return Result.error(ResultCode.LOGIN_FAIL, "验证码错误");
        }

        // 使用 Spring Security 进行认证
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
        try {
            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            // 设置认证信息到 SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 获取用户信息
            UserSimpleDetail userDetail = (UserSimpleDetail) authentication.getPrincipal();

            // 生成 Token 并存储用户信息到 Redis（包含设备、IP、浏览器信息）
            String token = sessionTokenContext.generateToken(userDetail, httpRequest);

            // 记录登录成功日志
            loginLogService.create(userDetail.getUserId(), userDetail.getUsername(), LoginActionType.LOGIN_SUCCESS, ip, browser, device);

            // 构建响应
            LoginResponse response = new LoginResponse();
            response.setToken(token);
            response.setPermissions(CollUtil.newArrayList(userDetail.getAuthorities()));

            return Result.success(response);
        } catch (RuntimeException e) {
            loginLogService.create(null, request.getUsername(), LoginActionType.LOGIN_FAIL, ip, browser, device);
            throw e;
        }
    }

    /**
     * 登出
     *
     * @param request HTTP 请求
     * @return 操作结果
     */
    @PostMapping("/logout")
    public Result<?> logout(HttpServletRequest request) {
        // 从请求头获取 Token
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StrUtil.isNotBlank(authHeader) && StrUtil.startWithIgnoreCase(authHeader, "Bearer ")) {
            String token = StrUtil.trim(authHeader.substring(7));
            // 从会话中获取当前用户信息并记录登出日志
            UserSimpleDetail userDetail = sessionTokenContext.getUserDetail(token);
            if (userDetail != null) {
                String userAgent = request.getHeader("User-Agent");
                String ip = WebUtils.getClientIp(request);
                String device = WebUtils.parseDevice(userAgent);
                String browser = WebUtils.parseBrowser(userAgent);
                loginLogService.create(userDetail.getUserId(), userDetail.getUsername(), LoginActionType.LOGOUT_SUCCESS, ip, browser, device);
            }
            // 从 Redis 删除 Token
            sessionTokenContext.removeToken(token);
        }
        // 清除 SecurityContext
        SecurityContextHolder.clearContext();
        return Result.success();
    }
}
