package cn.dsc.jk.config.security;

import cn.dsc.jk.dto.login.LoginSessionInfo;
import cn.dsc.jk.dto.user.UserSimpleDetail;
import cn.dsc.jk.service.SystemConfigService;
import cn.dsc.jk.util.WebUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RBucket;
import org.redisson.api.RSet;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * 会话 Token 上下文
 * 使用 Redis 存储用户会话信息，通过 Token 进行认证
 * 维护用户ID到Token集合的映射关系，便于管理用户的所有会话
 *
 * @author ding.shichen
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SessionTokenContext {

    private static final String SESSION_KEY_PREFIX = "session:";
    private static final String USER_TOKENS_KEY_PREFIX = "user_tokens:";

    private final RedissonClient redissonClient;
    private final SystemConfigService systemConfigService;

    /**
     * 生成 Token 并存储用户信息到 Redis
     *
     * @param userDetail 用户信息
     * @param request HTTP请求（用于提取设备、IP、浏览器信息）
     * @return Token
     */
    public String generateToken(UserSimpleDetail userDetail, HttpServletRequest request) {
        // 从系统配置获取是否允许多端在线
        boolean allowMultiLogin = systemConfigService.isAllowMultiLogin();
        if (!allowMultiLogin) {
            // 不允许多端在线时，先清理该用户的所有历史会话，仅保留即将创建的新会话
            removeSessionsByUserId(userDetail.getUserId());
        }

        String token = UUID.randomUUID().toString().replace("-", "");
        String sessionKey = SESSION_KEY_PREFIX + token;

        // 从系统配置获取过期时间
        long expirationMillis = systemConfigService.getUserLoginExpireMillis();

        // 存储用户信息到 Redis
        RBucket<UserSimpleDetail> bucket = redissonClient.getBucket(sessionKey);
        bucket.set(userDetail, Duration.ofMillis(expirationMillis));

        // 提取登录会话信息（设备、IP、浏览器）并保存到用户token集合中
        LoginSessionInfo sessionInfo;
        String userAgent = request.getHeader("User-Agent");
        String ip = WebUtils.getClientIp(request);
        String device = WebUtils.parseDevice(userAgent);
        String browser = WebUtils.parseBrowser(userAgent);
        
        sessionInfo = new LoginSessionInfo(device, ip, browser, LocalDateTime.now(), token);
        log.debug("保存登录会话信息: token={}, device={}, ip={}, browser={}", token, device, ip, browser);

        // 将登录会话信息（包含token）添加到用户的token集合中
        String userTokensKey = USER_TOKENS_KEY_PREFIX + userDetail.getUserId();
        RSet<LoginSessionInfo> userTokens = redissonClient.getSet(userTokensKey);
        userTokens.add(sessionInfo);
        userTokens.expire(Duration.ofMillis(expirationMillis));

        log.debug("生成会话 Token: {}, 用户: {}, 过期时间: {}ms", token, userDetail.getUsername(), expirationMillis);
        return token;
    }

    /**
     * 从 Redis 获取用户信息
     *
     * @param token Token
     * @return 用户信息，如果 Token 无效或过期则返回 null
     */
    public UserSimpleDetail getUserDetail(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }
        String key = SESSION_KEY_PREFIX + token;
        RBucket<UserSimpleDetail> bucket = redissonClient.getBucket(key);
        return bucket.get();
    }

    /**
     * 从 Token 中获取用户ID
     *
     * @param token Token
     * @return 用户ID，如果 Token 无效或过期则返回 null
     */
    public Long getUserIdFromToken(String token) {
        UserSimpleDetail userDetail = getUserDetail(token);
        return userDetail != null ? userDetail.getUserId() : null;
    }

    /**
     * 验证 Token 是否有效
     *
     * @param token Token
     * @return 是否有效
     */
    public boolean validateToken(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }
        String key = SESSION_KEY_PREFIX + token;
        RBucket<UserSimpleDetail> bucket = redissonClient.getBucket(key);
        return bucket.isExists();
    }

    /**
     * 刷新 Token 过期时间
     *
     * @param token Token
     */
    public void refreshToken(String token) {
        if (token == null || token.isBlank()) {
            return;
        }
        String key = SESSION_KEY_PREFIX + token;
        RBucket<UserSimpleDetail> bucket = redissonClient.getBucket(key);
        if (bucket.isExists()) {
            long expirationMillis = systemConfigService.getUserLoginExpireMillis();
            bucket.expire(Duration.ofMillis(expirationMillis));
            
            // 刷新用户token集合的过期时间
            UserSimpleDetail userDetail = bucket.get();
            if (userDetail != null) {
                String userTokensKey = USER_TOKENS_KEY_PREFIX + userDetail.getUserId();
                RSet<LoginSessionInfo> userTokens = redissonClient.getSet(userTokensKey);
                userTokens.expire(Duration.ofMillis(expirationMillis));
            }
            
            log.debug("刷新会话 Token 过期时间: {}", token);
        }
    }

    /**
     * 删除 Token（登出）
     *
     * @param token Token
     */
    public void removeToken(String token) {
        if (token == null || token.isBlank()) {
            return;
        }
        String sessionKey = SESSION_KEY_PREFIX + token;
        RBucket<UserSimpleDetail> bucket = redissonClient.getBucket(sessionKey);
        UserSimpleDetail userDetail = bucket.get();
        
        // 先从用户的 token 集合中移除对应的LoginSessionInfo（在删除session之前，确保能获取到userDetail）
        if (userDetail != null) {
            String userTokensKey = USER_TOKENS_KEY_PREFIX + userDetail.getUserId();
            RSet<LoginSessionInfo> userTokens = redissonClient.getSet(userTokensKey);
            // 查找并移除匹配token的LoginSessionInfo
            Set<LoginSessionInfo> sessionInfos = userTokens.readAll();
            for (LoginSessionInfo sessionInfo : sessionInfos) {
                if (token.equals(sessionInfo.getToken())) {
                    userTokens.remove(sessionInfo);
                    log.debug("从用户 {} 的token集合中移除token: {}", userDetail.getUserId(), token);
                    break;
                }
            }
        }
        
        // 删除会话数据
        bucket.delete();
        
        log.debug("删除会话 Token: {}", token);
    }

    /**
     * 根据用户ID删除该用户的所有会话
     * 用于用户被删除、锁定、重置密码、编辑等操作后强制下线
     *
     * @param userId 用户ID
     */
    public void removeSessionsByUserId(Long userId) {
        if (userId == null) {
            return;
        }
        String userTokensKey = USER_TOKENS_KEY_PREFIX + userId;
        RSet<LoginSessionInfo> userTokens = redissonClient.getSet(userTokensKey);
        
        // 获取该用户的所有登录会话信息
        Set<LoginSessionInfo> sessionInfos = userTokens.readAll();
        int count = 0;
        
        // 删除所有会话数据
        for (LoginSessionInfo sessionInfo : sessionInfos) {
            String token = sessionInfo.getToken();
            if (token != null) {
                String sessionKey = SESSION_KEY_PREFIX + token;
                RBucket<UserSimpleDetail> bucket = redissonClient.getBucket(sessionKey);
                if (bucket.delete()) {
                    count++;
                }
            }
        }
        
        // 删除用户的 token 集合
        userTokens.delete();
        
        if (count > 0) {
            log.info("已删除用户 {} 的 {} 个会话", userId, count);
        }
    }

    /**
     * 批量根据用户ID删除会话
     *
     * @param userIds 用户ID列表
     */
    public void removeSessionsByUserIds(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return;
        }
        int totalCount = 0;
        for (Long userId : userIds) {
            String userTokensKey = USER_TOKENS_KEY_PREFIX + userId;
            RSet<LoginSessionInfo> userTokens = redissonClient.getSet(userTokensKey);
            
            // 获取该用户的所有登录会话信息
            Set<LoginSessionInfo> sessionInfos = userTokens.readAll();
            
            // 删除所有会话数据
            for (LoginSessionInfo sessionInfo : sessionInfos) {
                String token = sessionInfo.getToken();
                if (token != null) {
                    String sessionKey = SESSION_KEY_PREFIX + token;
                    RBucket<UserSimpleDetail> bucket = redissonClient.getBucket(sessionKey);
                    if (bucket.delete()) {
                        totalCount++;
                    }
                }
            }
            
            // 删除用户的 token 集合
            userTokens.delete();
        }
        
        if (totalCount > 0) {
            log.info("已批量删除 {} 个用户的 {} 个会话", userIds.size(), totalCount);
        }
    }

    /**
     * 获取用户的在线状态和登录信息
     *
     * @param userId 用户ID
     * @return 登录会话信息列表，如果用户不在线则返回空列表
     */
    public List<LoginSessionInfo> getUserLoginSessions(Long userId) {
        if (userId == null) {
            return new ArrayList<>();
        }
        String userTokensKey = USER_TOKENS_KEY_PREFIX + userId;
        RSet<LoginSessionInfo> userTokens = redissonClient.getSet(userTokensKey);
        
        Set<LoginSessionInfo> sessionInfos = userTokens.readAll();
        List<LoginSessionInfo> validSessionInfos = new ArrayList<>();
        
        for (LoginSessionInfo sessionInfo : sessionInfos) {
            String token = sessionInfo.getToken();
            if (token != null) {
                // 验证token是否仍然有效
                String sessionKey = SESSION_KEY_PREFIX + token;
                RBucket<UserSimpleDetail> bucket = redissonClient.getBucket(sessionKey);
                if (bucket.isExists()) {
                    validSessionInfos.add(sessionInfo);
                }
            }
        }
        
        return validSessionInfos;
    }

    /**
     * 检查用户是否在线
     *
     * @param userId 用户ID
     * @return 是否在线
     */
    public boolean isUserOnline(Long userId) {
        if (userId == null) {
            return false;
        }
        String userTokensKey = USER_TOKENS_KEY_PREFIX + userId;
        RSet<LoginSessionInfo> userTokens = redissonClient.getSet(userTokensKey);
        
        Set<LoginSessionInfo> sessionInfos = userTokens.readAll();
        // 检查是否有有效的token
        for (LoginSessionInfo sessionInfo : sessionInfos) {
            String token = sessionInfo.getToken();
            if (token != null) {
                String sessionKey = SESSION_KEY_PREFIX + token;
                RBucket<UserSimpleDetail> bucket = redissonClient.getBucket(sessionKey);
                if (bucket.isExists()) {
                    return true;
                }
            }
        }
        
        return false;
    }
}
