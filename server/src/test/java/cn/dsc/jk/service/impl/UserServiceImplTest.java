package cn.dsc.jk.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.junit.jupiter.api.Test;

import cn.dsc.jk.JustKnowApplicationTests;
import cn.dsc.jk.entity.UserCredentialEntity;
import cn.dsc.jk.entity.UserEntity;
import cn.dsc.jk.service.UserCredentialService;
import cn.dsc.jk.service.UserService;
import lombok.extern.slf4j.Slf4j;

/**
 * 用户服务实现测试
 *
 * @author ding.shichen
 */
@Slf4j
public class UserServiceImplTest extends JustKnowApplicationTests {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private UserCredentialService userCredentialService;

    /**
     * 初始化管理员账号和密码到数据库
     */
    @Test
    void initAdminUser() {
        String account = "admin";
        String rawPassword = "ant.design";

        // 创建用户信息
        UserEntity user = new UserEntity();
        user.setUserName("系统管理员");
        user.setAvatarAttachId(1L);
        user.setAccount(account);
        user.setLockedFlag(false);
        user.setCreatedUserId(1L);
        user.setUpdatedUserId(1L);
        userService.save(user);

        // 创建用户凭证（密码）
        UserCredentialEntity credential = new UserCredentialEntity();
        credential.setUserId(user.getUserId());
        credential.setPassword(passwordEncoder.encode(rawPassword));
        userCredentialService.save(credential);

        log.info("初始化管理员账号完成，account={}, password={}, userId={}", account, rawPassword, user.getUserId());
    }
}
