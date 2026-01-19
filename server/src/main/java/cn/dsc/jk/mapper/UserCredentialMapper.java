package cn.dsc.jk.mapper;

import cn.dsc.jk.entity.UserCredentialEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.Date;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import org.springframework.security.web.authentication.rememberme.PersistentRememberMeToken;

/**
 * 用户凭证Mapper接口
 *
 * @author ding.shichen
 */
@Mapper
public interface UserCredentialMapper extends BaseMapper<UserCredentialEntity> {

    PersistentRememberMeToken selectBySeries(@Param("seriesId") String seriesId);

    void clearRememberMeByAccount(@Param("account") String account);

    void updateRememberMeBySeries(@Param("series") String series, @Param("tokenValue") String tokenValue, @Param("lastUsed") Date lastUsed);
}
