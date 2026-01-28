package cn.dsc.jk.service.impl;

import cn.dsc.jk.dto.role.RoleConvert;
import cn.dsc.jk.dto.role.RoleCreate;
import cn.dsc.jk.dto.role.RoleDetail;
import cn.dsc.jk.dto.role.RoleItem;
import cn.dsc.jk.dto.role.RoleOption;
import cn.dsc.jk.dto.role.RolePageQuery;
import cn.dsc.jk.dto.role.RoleUpdate;
import cn.dsc.jk.entity.RoleEntity;
import cn.dsc.jk.mapper.RoleMapper;
import cn.dsc.jk.service.RoleService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 角色服务实现类
 *
 * @author ding.shichen
 */
@Service
public class RoleServiceImpl extends ServiceImpl<RoleMapper, RoleEntity> implements RoleService {

    @Override
    public List<RoleOption> selectByIds(List<Long> ids) {
        return this.listByIds(ids).stream().map(RoleConvert.FU_TO_OPTION).toList();
    }

    @Override
    @Transactional
    public Long create(RoleCreate create) {
        RoleEntity entity = new RoleEntity();
        entity.setRoleName(create.getRoleName());
        entity.setRoleCode(create.getRoleCode());
        entity.setRoleDesc(create.getRoleDesc());
        this.save(entity);
        return entity.getRoleId();
    }

    @Override
    @Transactional
    public void update(Long roleId, RoleUpdate update) {
        RoleEntity entity = new RoleEntity();
        entity.setRoleId(roleId);
        entity.setRoleName(update.getRoleName());
        entity.setRoleCode(update.getRoleCode());
        entity.setRoleDesc(update.getRoleDesc());
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
        return RoleConvert.FU_TO_DETAIL.apply(this.getById(roleId));
    }

    @Override
    public PageInfo<RoleItem> page(RolePageQuery query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<RoleEntity> entities = this.baseMapper.selectList(
                query.getRoleName(),
                query.getRoleCode()
        );
        return new PageInfo<>(entities.stream().map(RoleConvert.FU_TO_ITEM).toList());
    }


}

