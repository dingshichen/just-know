package cn.dsc.jk.mapper;

import cn.dsc.jk.entity.RoleEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 角色Mapper接口
 *
 * @author ding.shichen
 */
@Mapper
public interface RoleMapper extends BaseMapper<RoleEntity> {

    /**
     * 分页查询列表
     *
     * @param roleName 角色名称（可选）
     * @param roleCode 角色编码（可选）
     * @return 角色列表
     */
    List<RoleEntity> selectByQuery(@Param("roleName") String roleName,
                                   @Param("roleCode") String roleCode);
}
