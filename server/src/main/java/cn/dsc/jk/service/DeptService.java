package cn.dsc.jk.service;

import cn.dsc.jk.dto.dept.DeptCreate;
import cn.dsc.jk.dto.dept.DeptDetail;
import cn.dsc.jk.dto.dept.DeptItem;
import cn.dsc.jk.dto.dept.DeptPageQuery;
import cn.dsc.jk.dto.dept.DeptOption;
import cn.dsc.jk.dto.dept.DeptUpdate;
import cn.dsc.jk.entity.DeptEntity;
import com.baomidou.mybatisplus.extension.service.IService;
import com.github.pagehelper.PageInfo;

import java.util.List;
import java.util.Map;

/**
 * 机构服务接口
 *
 * @author ding.shichen
 */
public interface DeptService extends IService<DeptEntity> {

    /**
     * 根据 ID 列表查询机构选项。
     *
     * @param ids ID 列表
     * @return 机构选项列表
     */
    List<DeptOption> selectByIds(List<Long> ids);

    /**
     * 根据 ID 列表查询机构选项映射。
     *
     * @param ids ID 列表
     * @return ID -> 机构选项 映射
     */
    Map<Long, DeptOption> mapsByIds(List<Long> ids);

    /**
     * 新增机构
     *
     * @param create 新增机构请求
     * @return 机构ID
     */
    Long create(DeptCreate create);

    /**
     * 修改机构
     *
     * @param deptId 机构ID
     * @param update 修改机构请求
     */
    void update(Long deptId, DeptUpdate update);

    /**
     * 删除机构
     *
     * @param deptId 机构ID
     */
    void delete(Long deptId);

    /**
     * 批量删除机构
     *
     * @param deptIds 机构ID列表
     */
    void deleteBatch(List<Long> deptIds);

    /**
     * 根据ID查询机构详情
     *
     * @param deptId 机构ID
     * @return 机构详情
     */
    DeptDetail load(Long deptId);

    /**
     * 分页查询机构列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    PageInfo<DeptItem> page(DeptPageQuery query);

    /**
     * 查询所有机构树形列表
     *
     * @return 机构树形列表
     */
    List<DeptItem> listAllTree();
}
