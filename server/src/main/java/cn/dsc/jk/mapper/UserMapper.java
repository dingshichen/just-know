package cn.dsc.jk.mapper;

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
     * @param userName 用户姓名（可选）
     * @param account 账号（可选）
     * @param phone 手机号码（可选）
     * @param email 电子邮箱（可选）
     * @param lockedFlag 锁定标志（可选）
     * @return 用户列表
     */
    List<UserEntity> selectList(@Param("userName") String userName,
                                @Param("account") String account,
                                @Param("phone") String phone,
                                @Param("email") String email,
                                @Param("lockedFlag") Integer lockedFlag);
}
