package cn.dsc.jk.service.impl;

import cn.dsc.jk.entity.UserCredentialEntity;
import cn.dsc.jk.mapper.UserCredentialMapper;
import cn.dsc.jk.service.UserCredentialService;
import cn.dsc.jk.util.SecurityContextUtil;
import cn.hutool.core.date.DateUtil;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import java.util.Date;

import org.springframework.security.web.authentication.rememberme.PersistentRememberMeToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户凭证服务实现类
 *
 * @author ding.shichen
 */
@Service
public class UserCredentialServiceImpl extends ServiceImpl<UserCredentialMapper, UserCredentialEntity> implements UserCredentialService {
    
    @Transactional
    @Override
    public void createNewToken(PersistentRememberMeToken token) {
        Long userId = SecurityContextUtil.getUserId();
        UserCredentialEntity userCredential = new UserCredentialEntity();
        userCredential.setUserId(userId);
        userCredential.setRememberMeService(token.getSeries());
        userCredential.setRememberMeToken(token.getTokenValue());
        userCredential.setRememberMeLastUsedTime(DateUtil.toLocalDateTime(token.getDate()));
        this.save(userCredential);
    }

    @Override
    public PersistentRememberMeToken getTokenForSeries(String seriesId) {
        PersistentRememberMeToken rememberMeToken = this.baseMapper.selectBySeries(seriesId);
        if (rememberMeToken == null) {
            return null;
        }
        if (rememberMeToken.getTokenValue() == null) {
            return null;
        }
        return rememberMeToken;
    }

    @Transactional
    @Override
    public void removeUserTokens(String username) {
        this.baseMapper.clearRememberMeByAccount(username);
    }

    @Transactional
    @Override
    public void updateToken(String series, String tokenValue, Date lastUsed) {
        this.baseMapper.updateRememberMeBySeries(series, tokenValue, lastUsed);
    }

}
