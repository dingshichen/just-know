package cn.dsc.jk.service;

import cn.dsc.jk.dto.menu.MenuCreate;
import cn.dsc.jk.dto.menu.MenuDetail;
import cn.dsc.jk.dto.menu.MenuItem;
import cn.dsc.jk.dto.menu.MenuPageQuery;
import cn.dsc.jk.dto.menu.MenuUpdate;
import cn.dsc.jk.entity.MenuEntity;
import com.baomidou.mybatisplus.extension.service.IService;
import com.github.pagehelper.PageInfo;

import java.util.List;

/**
 * 菜单服务接口
 *
 * @author ding.shichen
 */
public interface MenuService extends IService<MenuEntity> {

    /**
     * 新增菜单
     *
     * @param create 新增菜单请求
     * @return 菜单ID
     */
    Long create(MenuCreate create);

    /**
     * 修改菜单
     *
     * @param menuId 菜单ID
     * @param update 修改菜单请求
     */
    void update(Long menuId, MenuUpdate update);

    /**
     * 删除菜单
     *
     * @param menuId 菜单ID
     */
    void delete(Long menuId);

    /**
     * 批量删除菜单
     *
     * @param menuIds 菜单ID列表
     */
    void deleteBatch(List<Long> menuIds);

    /**
     * 根据ID查询菜单详情
     *
     * @param menuId 菜单ID
     * @return 菜单详情
     */
    MenuDetail load(Long menuId);

    /**
     * 分页查询菜单列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    PageInfo<MenuItem> page(MenuPageQuery query);
}
