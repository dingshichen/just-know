package cn.dsc.jk.service;

import cn.dsc.jk.dto.user.UserCreate;
import cn.dsc.jk.dto.user.UserDetail;
import cn.dsc.jk.dto.user.UserItem;
import cn.dsc.jk.dto.user.UserPageQuery;
import cn.dsc.jk.dto.user.UserSimpleDetail;
import cn.dsc.jk.dto.user.UserUpdate;
import cn.dsc.jk.entity.UserEntity;
import com.baomidou.mybatisplus.extension.service.IService;
import com.github.pagehelper.PageInfo;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * 用户服务接口
 *
 * @author ding.shichen
 */
public interface UserService extends IService<UserEntity>, UserDetailsService {

    /**
     * 新增用户
     *
     * @param create 新增用户请求
     * @return 用户ID
     */
    Long create(UserCreate create);

    /**
     * 修改用户
     *
     * @param userId 用户ID
     * @param update 修改用户请求
     */
    void update(Long userId, UserUpdate update);

    /**
     * 删除用户
     *
     * @param userId 用户ID
     */
    void delete(Long userId);

    /**
     * 批量删除用户
     *
     * @param userIds 用户ID列表
     */
    void deleteBatch(List<Long> userIds);

    /**
     * 根据ID查询用户详情
     *
     * @param userId 用户ID
     * @return 用户详情
     */
    UserDetail load(Long userId);

    /**
     * 分页查询用户列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    PageInfo<UserItem> page(UserPageQuery query);

    /**
     * 锁定用户
     *
     * @param userId 用户ID
     */
    void lock(Long userId);

    /**
     * 解除锁定用户
     *
     * @param userId 用户ID
     */
    void unlock(Long userId);

    /**
     * 分配角色
     *
     * @param userId 用户ID
     * @param roleIds 角色ID列表
     */
    void assignRoles(Long userId, List<Long> roleIds);

    /**
     * 根据用户ID查询简单详情（不含密码，用于当前登录用户等）
     *
     * @param userId 用户ID
     * @return 用户简单详情，不存在时返回 null
     */
    UserSimpleDetail loadSimpleDetail(Long userId);

    /**
     * 重置用户密码为默认密码 123456
     *
     * @param userId 用户ID
     */
    void resetPassword(Long userId);
}
