package cn.dsc.jk.service;

import cn.dsc.jk.dto.permission.PermissionCreate;
import cn.dsc.jk.dto.permission.PermissionDetail;
import cn.dsc.jk.dto.permission.PermissionItem;
import cn.dsc.jk.dto.permission.PermissionPageQuery;
import cn.dsc.jk.dto.permission.PermissionUpdate;
import cn.dsc.jk.entity.PermissionEntity;
import com.baomidou.mybatisplus.extension.service.IService;
import com.github.pagehelper.PageInfo;

import java.util.List;

/**
 * 权限服务接口
 *
 * @author ding.shichen
 */
public interface PermissionService extends IService<PermissionEntity> {

    /**
     * 新增权限
     *
     * @param create 新增权限请求
     * @return 权限ID
     */
    Long create(PermissionCreate create);

    /**
     * 修改权限
     *
     * @param permissionId 权限ID
     * @param update 修改权限请求
     */
    void update(Long permissionId, PermissionUpdate update);

    /**
     * 删除权限
     *
     * @param permissionId 权限ID
     */
    void delete(Long permissionId);

    /**
     * 批量删除权限
     *
     * @param permissionIds 权限ID列表
     */
    void deleteBatch(List<Long> permissionIds);

    /**
     * 根据ID查询权限详情
     *
     * @param permissionId 权限ID
     * @return 权限详情
     */
    PermissionDetail load(Long permissionId);

    /**
     * 分页查询权限列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    PageInfo<PermissionItem> page(PermissionPageQuery query);
}
