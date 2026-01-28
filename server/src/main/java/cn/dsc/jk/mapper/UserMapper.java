package cn.dsc.jk.mapper;

import cn.dsc.jk.dto.user.UserPageQuery;
import cn.dsc.jk.dto.user.UserSimpleDetail;
import cn.dsc.jk.entity.UserEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户Mapper接口
 *
 * @author ding.shichen
 */
@Mapper
public interface UserMapper extends BaseMapper<UserEntity> {

    /**
     * 分页查询列表
     *
     * @param query 查询条件
     * @return 用户列表
     */
    List<UserEntity> selectList(@Param("query") UserPageQuery query);

    /**
     * 根据账号查询用户简单详情（包含凭证信息）
     *
     * @param account 账号
     * @return 用户简单详情
     */
    UserSimpleDetail selectSimpleDetailByAccount(@Param("account") String account);

    /**
     * 根据用户ID查询用户简单详情（不含密码，用于 /current 等接口）
     *
     * @param userId 用户ID
     * @return 用户简单详情
     */
    UserSimpleDetail selectSimpleDetailById(@Param("userId") Long userId);
}
