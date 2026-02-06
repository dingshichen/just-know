package cn.dsc.jk.control;

import cn.dsc.jk.common.Result;
import cn.dsc.jk.common.ResultCode;
import cn.dsc.jk.config.ops.OpsLog;
import cn.dsc.jk.dto.user.UserCreate;
import cn.dsc.jk.dto.user.UserDetail;
import cn.dsc.jk.dto.user.UserItem;
import cn.dsc.jk.dto.user.UserPageQuery;
import cn.dsc.jk.dto.user.UserSimpleDetail;
import cn.dsc.jk.dto.user.UserUpdate;
import cn.dsc.jk.service.UserDeptRelService;
import cn.dsc.jk.service.UserService;
import cn.dsc.jk.util.SecurityContextUtil;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户控制器
 *
 * @author ding.shichen
 */
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserDeptRelService userDeptService;

    /**
     * 新增用户
     *
     * @param create 新增用户请求
     * @return 用户ID
     */
    @OpsLog(module = "用户管理", name = "新增用户")
    @PostMapping
    public Result<Long> create(@RequestBody UserCreate create) {
        Long userId = userService.create(create);
        return Result.success(userId);
    }

    /**
     * 修改用户
     *
     * @param userId 用户ID
     * @param update 修改用户请求
     * @return 操作结果
     */
    @OpsLog(module = "用户管理", name = "修改用户")
    @PutMapping("/{userId}")
    public Result<?> update(@PathVariable Long userId, @RequestBody UserUpdate update) {
        userService.update(userId, update);
        return Result.success();
    }

    /**
     * 删除用户
     *
     * @param userId 用户ID
     */
    @OpsLog(module = "用户管理", name = "删除用户")
    @DeleteMapping("/{userId}")
    public Result<?> delete(@PathVariable Long userId) {
        userService.delete(userId);
        return Result.success();
    }

    /**
     * 批量删除用户
     *
     * @param userIds 用户ID列表
     */
    @OpsLog(module = "用户管理", name = "批量删除用户")
    @DeleteMapping("/batch")
    public Result<?> deleteBatch(@RequestParam("userIds") List<Long> userIds) {
        userService.deleteBatch(userIds);
        return Result.success();
    }

    /**
     * 获取当前登录用户简单信息
     *
     * @return 当前用户的 UserSimpleDetail
     */
    @GetMapping("/current")
    public Result<UserSimpleDetail> current() {
        return Result.success(SecurityContextUtil.getUser());
    }

    /**
     * 根据ID查询用户详情
     *
     * @param userId 用户ID
     * @return 用户详情
     */
    @OpsLog(module = "用户管理", name = "根据ID查询用户详情")
    @GetMapping("/{userId}")
    public Result<UserDetail> load(@PathVariable Long userId) {
        UserDetail detail = userService.load(userId);
        return Result.success(detail);
    }

    /**
     * 分页查询用户列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    @OpsLog(module = "用户管理", name = "分页查询用户列表")
    @GetMapping("/page")
    public Result<PageInfo<UserItem>> page(UserPageQuery query) {
        PageInfo<UserItem> pageInfo = userService.page(query);
        return Result.success(pageInfo);
    }

    /**
     * 锁定用户
     *
     * @param userId 用户ID
     * @return 操作结果
     */
    @OpsLog(module = "用户管理", name = "锁定用户")
    @PutMapping("/{userId}/lock")
    public Result<?> lock(@PathVariable Long userId) {
        userService.lock(userId);
        return Result.success();
    }

    /**
     * 解除锁定用户
     *
     * @param userId 用户ID
     */
    @OpsLog(module = "用户管理", name = "解除锁定用户")
    @PutMapping("/{userId}/unlock")
    public Result<?> unlock(@PathVariable Long userId) {
        userService.unlock(userId);
        return Result.success();
    }

    /**
     * 重置用户密码为默认密码 123456
     *
     * @param userId 用户ID
     */
    @OpsLog(module = "用户管理", name = "重置用户密码")
    @PutMapping("/{userId}/reset-password")
    public Result<?> resetPassword(@PathVariable Long userId) {
        userService.resetPassword(userId);
        return Result.success();
    }

    /**
     * 分配角色
     *
     * @param userId 用户ID
     * @param roleIds 角色ID列表
     */
    @OpsLog(module = "用户管理", name = "分配角色")
    @PutMapping("/{userId}/roles")
    public Result<?> assignRoles(@PathVariable Long userId, @RequestBody List<Long> roleIds) {
        userService.assignRoles(userId, roleIds);
        return Result.success();
    }

    /**
     * 获取用户部门ID列表（用于编辑时回显）
     *
     * @param userId 用户ID
     * @return 部门ID列表
     */
    @GetMapping("/{userId}/depts")
    public Result<List<Long>> getUserDeptIds(@PathVariable Long userId) {
        List<Long> deptIds = userDeptService.getDeptIdsByUserId(userId);
        return Result.success(deptIds != null ? deptIds : new java.util.ArrayList<>());
    }
}
