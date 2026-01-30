package cn.dsc.jk.service;

import cn.dsc.jk.entity.UserCredentialEntity;

import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

import com.baomidou.mybatisplus.extension.service.IService;

/**
 * 用户凭证服务接口
 *
 * @author ding.shichen
 */
public interface UserCredentialService extends IService<UserCredentialEntity>, PersistentTokenRepository {

    /**
     * 设置用户密码（明文由调用方编码后传入）
     *
     * @param userId         用户ID
     * @param encodedPassword 已编码的密码
     */
    void setPassword(Long userId, String encodedPassword);
}
