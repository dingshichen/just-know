package cn.dsc.jk.control;

import cn.dsc.jk.common.Result;
import cn.dsc.jk.common.ResultCode;
import cn.dsc.jk.config.security.JwtContext;
import cn.dsc.jk.dto.login.CaptchaDetail;
import cn.dsc.jk.dto.login.LoginRequest;
import cn.dsc.jk.dto.login.LoginResponse;
import cn.dsc.jk.dto.user.UserSimpleDetail;
import cn.dsc.jk.service.CaptchaService;
import cn.dsc.jk.consts.ValidateResult;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


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
    private final JwtContext jwtContext;

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
     * @return 登录响应
     */
    @PostMapping("/login/password")
    public Result<LoginResponse> login(@RequestBody LoginRequest request) {
        // 验证参数
        if (StrUtil.isBlank(request.getUsername()) || StrUtil.isBlank(request.getPassword())) {
            return Result.error(ResultCode.LOGIN_FAIL, "账号或密码不能为空");
        }
        if (StrUtil.isBlank(request.getCaptcha()) || StrUtil.isBlank(request.getCaptchaId())) {
            return Result.error(ResultCode.LOGIN_FAIL, "验证码不能为空");
        }

        // 验证验证码
        ValidateResult validateResult = captchaService.validateCaptcha(request.getCaptchaId(), request.getCaptcha());
        if (validateResult == ValidateResult.EXPIRED) {
            return Result.error(ResultCode.LOGIN_FAIL, "验证码已过期，请重新获取");
        }
        if (validateResult == ValidateResult.ERROR) {
            return Result.error(ResultCode.LOGIN_FAIL, "验证码错误");
        }

        // 使用 Spring Security 进行认证
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
        Authentication authentication = authenticationManager.authenticate(authenticationToken);

        // 设置认证信息到 SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 获取用户信息
        UserSimpleDetail userDetail = (UserSimpleDetail) authentication.getPrincipal();

        // 生成 JWT token
        String token = jwtContext.generateToken(userDetail.getUserId(), userDetail.getUsername());

        // 构建响应
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setPermissions(CollUtil.newArrayList(userDetail.getAuthorities()));

        return Result.success(response);
    }

    /**
     * 登出
     *
     * @return 操作结果
     */
    @PostMapping("/logout")
    public Result<?> logout() {
        // 清除 SecurityContext
        SecurityContextHolder.clearContext();
        return Result.success();
    }
}
