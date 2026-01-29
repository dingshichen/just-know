package cn.dsc.jk.service;

import cn.dsc.jk.dto.role.RoleCreate;
import cn.dsc.jk.dto.role.RoleDetail;
import cn.dsc.jk.dto.role.RoleItem;
import cn.dsc.jk.dto.role.RoleOption;
import cn.dsc.jk.dto.role.RolePageQuery;
import cn.dsc.jk.dto.role.RoleUpdate;
import cn.dsc.jk.entity.RoleEntity;

import com.baomidou.mybatisplus.extension.service.IService;
import com.github.pagehelper.PageInfo;

import java.util.List;
import java.util.Map;

/**
 * 角色服务接口
 *
 * @author ding.shichen
 */
public interface RoleService extends IService<RoleEntity> {

    /**
     * 根据 ID 列表查询角色选项。
     *
     * @param ids ID 列表
     * @return 角色选项列表
     */
    List<RoleOption> selectByIds(List<Long> ids);

    /**
     * 根据 ID 列表查询角色选项映射。
     *
     * @param ids ID 列表
     * @return ID -> 角色选项 映射
     */
    Map<Long, RoleOption> mapsByIds(List<Long> ids);

    /**
     * 新增角色
     *
     * @param create 新增角色请求
     * @return 角色ID
     */
    Long create(RoleCreate create);

    /**
     * 修改角色
     *
     * @param roleId 角色ID
     * @param update 修改角色请求
     */
    void update(Long roleId, RoleUpdate update);

    /**
     * 删除角色
     *
     * @param roleId 角色ID
     */
    void delete(Long roleId);

    /**
     * 批量删除角色
     *
     * @param roleIds 角色ID列表
     */
    void deleteBatch(List<Long> roleIds);

    /**
     * 根据ID查询角色详情
     *
     * @param roleId 角色ID
     * @return 角色详情
     */
    RoleDetail load(Long roleId);

    /**
     * 分页查询角色列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    PageInfo<RoleItem> page(RolePageQuery query);
}
