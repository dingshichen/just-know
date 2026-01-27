package cn.dsc.jk.control;

import cn.dsc.jk.common.Result;
import cn.dsc.jk.dto.dept.DeptCreate;
import cn.dsc.jk.dto.dept.DeptDetail;
import cn.dsc.jk.dto.dept.DeptItem;
import cn.dsc.jk.dto.dept.DeptPageQuery;
import cn.dsc.jk.dto.dept.DeptUpdate;
import cn.dsc.jk.service.DeptService;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 机构控制器
 *
 * @author ding.shichen
 */
@RestController
@RequestMapping("/dept")
@RequiredArgsConstructor
public class DeptController {

    private final DeptService deptService;

    /**
     * 新增机构
     *
     * @param create 新增机构请求
     * @return 机构ID
     */
    @PostMapping
    public Result<Long> create(@RequestBody DeptCreate create) {
        Long deptId = deptService.create(create);
        return Result.success(deptId);
    }

    /**
     * 修改机构
     *
     * @param deptId 机构ID
     * @param update 修改机构请求
     * @return 操作结果
     */
    @PutMapping("/{deptId}")
    public Result<?> update(@PathVariable Long deptId, @RequestBody DeptUpdate update) {
        deptService.update(deptId, update);
        return Result.success();
    }

    /**
     * 删除机构
     *
     * @param deptId 机构ID
     * @return 操作结果
     */
    @DeleteMapping("/{deptId}")
    public Result<?> delete(@PathVariable Long deptId) {
        deptService.delete(deptId);
        return Result.success();
    }

    /**
     * 批量删除机构
     *
     * @param deptIds 机构ID列表
     * @return 操作结果
     */
    @DeleteMapping("/batch")
    public Result<?> deleteBatch(@RequestParam("deptIds") List<Long> deptIds) {
        deptService.deleteBatch(deptIds);
        return Result.success();
    }

    /**
     * 根据ID查询机构详情
     *
     * @param deptId 机构ID
     * @return 机构详情
     */
    @GetMapping("/{deptId}")
    public Result<DeptDetail> load(@PathVariable Long deptId) {
        DeptDetail detail = deptService.load(deptId);
        return Result.success(detail);
    }

    /**
     * 分页查询机构列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<PageInfo<DeptItem>> page(DeptPageQuery query) {
        PageInfo<DeptItem> pageInfo = deptService.page(query);
        return Result.success(pageInfo);
    }

    /**
     * 查询所有机构树形列表
     *
     * @return 机构树形列表
     */
    @GetMapping("/tree")
    public Result<List<DeptItem>> listAllTree() {
        List<DeptItem> tree = deptService.listAllTree();
        return Result.success(tree);
    }
}
