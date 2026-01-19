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
}
