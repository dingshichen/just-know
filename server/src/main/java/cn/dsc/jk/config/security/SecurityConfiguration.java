package cn.dsc.jk.config.security;

import java.nio.charset.StandardCharsets;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import cn.dsc.jk.common.Result;
import cn.dsc.jk.common.ResultCode;
import lombok.RequiredArgsConstructor;

/**
 * @author ding.shichen
 */
@EnableMethodSecurity
@RequiredArgsConstructor
@Configuration
public class SecurityConfiguration {

    private final ObjectMapper objectMapper;
    private final UserCertificateService userCertificateService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/index").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginProcessingUrl("/auth/password")
                        .permitAll()
                        .successHandler(successHandler())
                        .failureHandler(failureHandler())
                )
                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .logoutSuccessHandler(logoutSuccessHandler())
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint())
                        .accessDeniedHandler(accessDeniedHandler())
                )
                .rememberMe(remember -> remember
                        .tokenRepository(userCertificateService)
                )
                .csrf(csrf -> csrf.disable())
                .build();
    }

    private AuthenticationSuccessHandler successHandler() {
        return (request, response, authentication) -> {
            response.setStatus(HttpStatus.OK.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.getWriter().println(objectMapper.writeValueAsString(Result.success()));
        };
    }

    private AuthenticationFailureHandler failureHandler() {
        return (request, response, exception) -> {
            response.setStatus(HttpStatus.OK.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.getWriter().println(objectMapper.writeValueAsString(Result.error(ResultCode.LOGIN_FAIL)));
        };
    }

    private LogoutSuccessHandler logoutSuccessHandler() {
        return (request, response, authentication) -> {
            response.setStatus(HttpStatus.OK.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.getWriter().println(objectMapper.writeValueAsString(Result.success()));
        };
    }

    private AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            // 未认证的请求
            response.setStatus(HttpStatus.OK.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            ResultCode resultCode = authException instanceof LockedException
                    ? ResultCode.LOGIN_LOCKED
                    : ResultCode.AUTH_FAIL;
            response.getWriter().println(objectMapper.writeValueAsString(Result.error(resultCode)));
        };
    }

    private AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            // 未授权的请求
            response.setStatus(HttpStatus.OK.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.getWriter().println(objectMapper.writeValueAsString(Result.error(ResultCode.PERMISSION_FAIL)));
        };
    }
}
