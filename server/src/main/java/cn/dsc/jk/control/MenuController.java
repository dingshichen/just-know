package cn.dsc.jk.control;

import cn.dsc.jk.common.Result;
import cn.dsc.jk.dto.menu.MenuCreate;
import cn.dsc.jk.dto.menu.MenuDetail;
import cn.dsc.jk.dto.menu.MenuItem;
import cn.dsc.jk.dto.menu.MenuPageQuery;
import cn.dsc.jk.dto.menu.MenuUpdate;
import cn.dsc.jk.service.MenuService;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 菜单控制器
 *
 * @author ding.shichen
 */
@RestController
@RequestMapping("/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    /**
     * 新增菜单
     *
     * @param create 新增菜单请求
     * @return 菜单ID
     */
    @PostMapping
    public Result<Long> create(@RequestBody MenuCreate create) {
        Long menuId = menuService.create(create);
        return Result.success(menuId);
    }

    /**
     * 修改菜单
     *
     * @param menuId 菜单ID
     * @param update 修改菜单请求
     * @return 操作结果
     */
    @PutMapping("/{menuId}")
    public Result<?> update(@PathVariable Long menuId, @RequestBody MenuUpdate update) {
        menuService.update(menuId, update);
        return Result.success();
    }

    /**
     * 删除菜单
     *
     * @param menuId 菜单ID
     * @return 操作结果
     */
    @DeleteMapping("/{menuId}")
    public Result<?> delete(@PathVariable Long menuId) {
        menuService.delete(menuId);
        return Result.success();
    }

    /**
     * 批量删除菜单
     *
     * @param menuIds 菜单ID列表
     * @return 操作结果
     */
    @DeleteMapping("/batch")
    public Result<?> deleteBatch(@RequestParam("menuIds") List<Long> menuIds) {
        menuService.deleteBatch(menuIds);
        return Result.success();
    }

    /**
     * 根据ID查询菜单详情
     *
     * @param menuId 菜单ID
     * @return 菜单详情
     */
    @GetMapping("/{menuId}")
    public Result<MenuDetail> load(@PathVariable Long menuId) {
        MenuDetail detail = menuService.load(menuId);
        return Result.success(detail);
    }

    /**
     * 分页查询菜单列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<PageInfo<MenuItem>> page(MenuPageQuery query) {
        PageInfo<MenuItem> pageInfo = menuService.page(query);
        return Result.success(pageInfo);
    }
}
