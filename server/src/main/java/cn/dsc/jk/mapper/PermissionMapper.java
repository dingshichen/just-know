package cn.dsc.jk.mapper;

import cn.dsc.jk.entity.PermissionEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 权限Mapper接口
 *
 * @author ding.shichen
 */
@Mapper
public interface PermissionMapper extends BaseMapper<PermissionEntity> {

    /**
     * 分页查询列表
     *
     * @param permissionName 权限名称（可选）
     * @param permissionCode 权限编码（可选）
     * @return 权限列表
     */
    List<PermissionEntity> selectList(@Param("permissionName") String permissionName,
                                      @Param("permissionCode") String permissionCode);
}
