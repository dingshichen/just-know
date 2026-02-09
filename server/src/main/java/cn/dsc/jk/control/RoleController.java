package cn.dsc.jk.control;

import cn.dsc.jk.common.Result;
import cn.dsc.jk.dto.role.RoleCreate;
import cn.dsc.jk.dto.role.RoleDetail;
import cn.dsc.jk.dto.role.RoleItem;
import cn.dsc.jk.dto.role.RolePageQuery;
import cn.dsc.jk.dto.role.RoleUpdate;
import cn.dsc.jk.service.RoleService;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 角色控制器
 *
 * @author ding.shichen
 */
@RestController
@RequestMapping("/role")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    /**
     * 新增角色
     *
     * @param create 新增角色请求
     * @return 角色ID
     */
    @PostMapping
    public Result<Long> create(@RequestBody RoleCreate create) {
        Long roleId = roleService.create(create);
        return Result.success(roleId);
    }

    /**
     * 修改角色
     *
     * @param roleId 角色ID
     * @param update 修改角色请求
     * @return 操作结果
     */
    @PutMapping("/{roleId}")
    public Result<?> update(@PathVariable Long roleId, @RequestBody RoleUpdate update) {
        roleService.update(roleId, update);
        return Result.success();
    }

    /**
     * 删除角色
     *
     * @param roleId 角色ID
     * @return 操作结果
     */
    @DeleteMapping("/{roleId}")
    public Result<?> delete(@PathVariable Long roleId) {
        roleService.delete(roleId);
        return Result.success();
    }

    /**
     * 批量删除角色
     *
     * @param roleIds 角色ID列表
     * @return 操作结果
     */
    @DeleteMapping("/batch")
    public Result<?> deleteBatch(@RequestParam("roleIds") List<Long> roleIds) {
        roleService.deleteBatch(roleIds);
        return Result.success();
    }

    /**
     * 根据ID查询角色详情
     *
     * @param roleId 角色ID
     * @return 角色详情
     */
    @GetMapping("/{roleId}")
    public Result<RoleDetail> load(@PathVariable Long roleId) {
        RoleDetail detail = roleService.load(roleId);
        return Result.success(detail);
    }

    /**
     * 分页查询角色列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<PageInfo<RoleItem>> page(RolePageQuery query) {
        PageInfo<RoleItem> pageInfo = roleService.page(query);
        return Result.success(pageInfo);
    }

    /**
     * 查询所有角色列表
     *
     * @return 角色列表
     */
    @GetMapping("/list")
    public Result<List<RoleItem>> listAll() {
        List<RoleItem> list = roleService.listAll();
        return Result.success(list);
    }
}
