package cn.dsc.jk.mapper;

import cn.dsc.jk.entity.MenuEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 菜单Mapper接口
 *
 * @author ding.shichen
 */
@Mapper
public interface MenuMapper extends BaseMapper<MenuEntity> {

    /**
     * 分页查询列表
     *
     * @param menuName 菜单名称（可选）
     * @param menuType 菜单类型（可选）
     * @param parentMenuId 父级菜单ID（可选）
     * @return 菜单列表
     */
    List<MenuEntity> selectList(@Param("menuName") String menuName,
                                @Param("menuType") String menuType,
                                @Param("parentMenuId") Long parentMenuId);
}
