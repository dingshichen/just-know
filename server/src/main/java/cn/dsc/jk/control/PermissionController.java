package cn.dsc.jk.control;

import cn.dsc.jk.common.Result;
import cn.dsc.jk.dto.permission.PermissionCreate;
import cn.dsc.jk.dto.permission.PermissionDetail;
import cn.dsc.jk.dto.permission.PermissionItem;
import cn.dsc.jk.dto.permission.PermissionPageQuery;
import cn.dsc.jk.dto.permission.PermissionUpdate;
import cn.dsc.jk.service.PermissionService;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 权限控制器
 *
 * @author ding.shichen
 */
@RestController
@RequestMapping("/permission")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    /**
     * 新增权限
     *
     * @param create 新增权限请求
     * @return 权限ID
     */
    @PostMapping
    public Result<Long> create(@RequestBody PermissionCreate create) {
        Long permissionId = permissionService.create(create);
        return Result.success(permissionId);
    }

    /**
     * 修改权限
     *
     * @param permissionId 权限ID
     * @param update 修改权限请求
     * @return 操作结果
     */
    @PutMapping("/{permissionId}")
    public Result<?> update(@PathVariable Long permissionId, @RequestBody PermissionUpdate update) {
        permissionService.update(permissionId, update);
        return Result.success();
    }

    /**
     * 删除权限
     *
     * @param permissionId 权限ID
     * @return 操作结果
     */
    @DeleteMapping("/{permissionId}")
    public Result<?> delete(@PathVariable Long permissionId) {
        permissionService.delete(permissionId);
        return Result.success();
    }

    /**
     * 批量删除权限
     *
     * @param permissionIds 权限ID列表
     * @return 操作结果
     */
    @DeleteMapping("/batch")
    public Result<?> deleteBatch(@RequestParam("permissionIds") List<Long> permissionIds) {
        permissionService.deleteBatch(permissionIds);
        return Result.success();
    }

    /**
     * 根据ID查询权限详情
     *
     * @param permissionId 权限ID
     * @return 权限详情
     */
    @GetMapping("/{permissionId}")
    public Result<PermissionDetail> load(@PathVariable Long permissionId) {
        PermissionDetail detail = permissionService.load(permissionId);
        return Result.success(detail);
    }

    /**
     * 分页查询权限列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<PageInfo<PermissionItem>> page(PermissionPageQuery query) {
        PageInfo<PermissionItem> pageInfo = permissionService.page(query);
        return Result.success(pageInfo);
    }
}
