package cn.dsc.jk.service.impl;

import cn.dsc.jk.dto.dept.DeptConvert;
import cn.dsc.jk.dto.dept.DeptCreate;
import cn.dsc.jk.dto.dept.DeptDetail;
import cn.dsc.jk.dto.dept.DeptItem;
import cn.dsc.jk.dto.dept.DeptPageQuery;
import cn.dsc.jk.dto.dept.DeptOption;
import cn.dsc.jk.dto.dept.DeptUpdate;
import cn.dsc.jk.entity.DeptEntity;
import cn.dsc.jk.mapper.DeptMapper;
import cn.dsc.jk.service.DeptService;
import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 机构服务实现类
 *
 * @author ding.shichen
 */
@Service
public class DeptServiceImpl extends ServiceImpl<DeptMapper, DeptEntity> implements DeptService {

    @Autowired
    private DeptMapper deptMapper;

    @Override
    public List<DeptOption> selectByIds(List<Long> ids) {
        return deptMapper.selectBatchIds(ids).stream().map(DeptConvert.FU_TO_OPTION).toList();
    }

    @Override
    @Transactional
    public Long create(DeptCreate create) {
        DeptEntity entity = new DeptEntity();
        entity.setDeptName(create.getDeptName());
        entity.setDeptCode(create.getDeptCode());
        entity.setDeptDesc(create.getDeptDesc());
        entity.setParentDeptId(create.getParentDeptId());
        entity.setSortNo(create.getSortNo());
        this.save(entity);
        return entity.getDeptId();
    }

    @Override
    @Transactional
    public void update(Long deptId, DeptUpdate update) {
        DeptEntity entity = new DeptEntity();
        entity.setDeptId(deptId);
        entity.setDeptName(update.getDeptName());
        entity.setDeptCode(update.getDeptCode());
        entity.setDeptDesc(update.getDeptDesc());
        entity.setParentDeptId(update.getParentDeptId());
        entity.setSortNo(update.getSortNo());
        this.updateById(entity);
    }

    @Override
    @Transactional
    public void delete(Long deptId) {
        // 检查是否有子机构
        List<DeptEntity> children = deptMapper.selectByParentDeptId(deptId);
        if (CollUtil.isNotEmpty(children)) {
            throw new RuntimeException("该机构下存在子机构，无法删除");
        }
        this.removeById(deptId);
    }

    @Override
    @Transactional
    public void deleteBatch(List<Long> deptIds) {
        for (Long deptId : deptIds) {
            delete(deptId);
        }
    }

    @Override
    public DeptDetail load(Long deptId) {
        return DeptConvert.FU_TO_DETAIL.apply(this.getById(deptId));
    }

    @Override
    public PageInfo<DeptItem> page(DeptPageQuery query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<DeptEntity> entities = deptMapper.selectList(
                query.getDeptName(),
                query.getDeptCode(),
                query.getParentDeptId()
        );

        return new PageInfo<>(entities.stream().map(DeptConvert.FU_TO_ITEM).toList());
    }

    @Override
    public List<DeptItem> listAllTree() {
        List<DeptEntity> entities = deptMapper.selectAll();
        return buildTree(entities.stream().map(DeptConvert.FU_TO_ITEM).toList());
    }

    /**
     * 构建树形结构
     *
     * @param items 所有机构列表（已按 sort_no 排序）
     * @return 树形结构列表
     */
    private List<DeptItem> buildTree(List<DeptItem> items) {
        // 按 parentDeptId 分组（使用 LinkedHashMap 保持顺序，由于 items 已按 sort_no 排序，分组后的列表会保持原有顺序）
        Map<Long, List<DeptItem>> childrenMap = items.stream()
                .filter(item -> item.getParentDeptId() != null)
                .collect(Collectors.groupingBy(
                        DeptItem::getParentDeptId,
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        // 设置子节点（保持数据库查询的排序）
        items.forEach(item -> {
            List<DeptItem> children = childrenMap.get(item.getDeptId());
            if (CollUtil.isNotEmpty(children)) {
                item.setChildren(children);
            }
        });

        // 返回根节点（parentDeptId 为 null 的节点，保持数据库查询的排序）
        return items.stream()
                .filter(item -> item.getParentDeptId() == null)
                .collect(Collectors.toList());
    }
}
