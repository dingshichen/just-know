package cn.dsc.jk.service.impl;

import cn.dsc.jk.dto.role.RoleCreate;
import cn.dsc.jk.dto.role.RoleDetail;
import cn.dsc.jk.dto.role.RoleItem;
import cn.dsc.jk.dto.role.RolePageQuery;
import cn.dsc.jk.dto.role.RoleUpdate;
import cn.dsc.jk.entity.RoleEntity;
import cn.dsc.jk.mapper.RoleMapper;
import cn.dsc.jk.service.RoleService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 角色服务实现类
 *
 * @author ding.shichen
 */
@Service
public class RoleServiceImpl extends ServiceImpl<RoleMapper, RoleEntity> implements RoleService {

    @Override
    @Transactional
    public Long create(RoleCreate create) {
        RoleEntity entity = new RoleEntity();
        BeanUtils.copyProperties(create, entity);
        this.save(entity);
        return entity.getRoleId();
    }

    @Override
    @Transactional
    public void update(Long roleId, RoleUpdate update) {
        RoleEntity entity = new RoleEntity();
        entity.setRoleId(roleId);
        BeanUtils.copyProperties(update, entity);
        this.updateById(entity);
    }

    @Override
    @Transactional
    public void delete(Long roleId) {
        this.removeById(roleId);
    }

    @Override
    @Transactional
    public void deleteBatch(List<Long> roleIds) {
        this.removeBatchByIds(roleIds);
    }

    @Override
    public RoleDetail load(Long roleId) {
        RoleEntity entity = this.getById(roleId);
        if (entity == null) {
            return null;
        }

        RoleDetail detail = new RoleDetail();
        BeanUtils.copyProperties(entity, detail);
        return detail;
    }

    @Override
    public PageInfo<RoleItem> page(RolePageQuery query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<RoleEntity> entities = this.baseMapper.selectList(
                query.getRoleName(),
                query.getRoleCode()
        );

        List<RoleItem> items = entities.stream().map(entity -> {
            RoleItem item = new RoleItem();
            BeanUtils.copyProperties(entity, item);
            return item;
        }).collect(Collectors.toList());

        return new PageInfo<>(items);
    }
}
