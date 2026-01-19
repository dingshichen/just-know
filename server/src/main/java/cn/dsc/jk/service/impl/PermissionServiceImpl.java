package cn.dsc.jk.service.impl;

import cn.dsc.jk.dto.permission.PermissionCreate;
import cn.dsc.jk.dto.permission.PermissionDetail;
import cn.dsc.jk.dto.permission.PermissionItem;
import cn.dsc.jk.dto.permission.PermissionPageQuery;
import cn.dsc.jk.dto.permission.PermissionUpdate;
import cn.dsc.jk.entity.PermissionEntity;
import cn.dsc.jk.mapper.PermissionMapper;
import cn.dsc.jk.service.PermissionService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 权限服务实现类
 *
 * @author ding.shichen
 */
@Service
public class PermissionServiceImpl extends ServiceImpl<PermissionMapper, PermissionEntity> implements PermissionService {

    @Override
    @Transactional
    public Long create(PermissionCreate create) {
        PermissionEntity entity = new PermissionEntity();
        BeanUtils.copyProperties(create, entity);
        this.save(entity);
        return entity.getPermissionId();
    }

    @Override
    @Transactional
    public void update(Long permissionId, PermissionUpdate update) {
        PermissionEntity entity = new PermissionEntity();
        entity.setPermissionId(permissionId);
        BeanUtils.copyProperties(update, entity);
        this.updateById(entity);
    }

    @Override
    @Transactional
    public void delete(Long permissionId) {
        this.removeById(permissionId);
    }

    @Override
    @Transactional
    public void deleteBatch(List<Long> permissionIds) {
        this.removeBatchByIds(permissionIds);
    }

    @Override
    public PermissionDetail load(Long permissionId) {
        PermissionEntity entity = this.getById(permissionId);
        if (entity == null) {
            return null;
        }

        PermissionDetail detail = new PermissionDetail();
        BeanUtils.copyProperties(entity, detail);
        return detail;
    }

    @Override
    public PageInfo<PermissionItem> page(PermissionPageQuery query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<PermissionEntity> entities = this.baseMapper.selectList(
                query.getPermissionName(),
                query.getPermissionCode()
        );

        List<PermissionItem> items = entities.stream().map(entity -> {
            PermissionItem item = new PermissionItem();
            BeanUtils.copyProperties(entity, item);
            return item;
        }).collect(Collectors.toList());

        return new PageInfo<>(items);
    }
}
