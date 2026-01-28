package cn.dsc.jk.service.impl;

import cn.dsc.jk.dto.menu.MenuConvert;
import cn.dsc.jk.dto.menu.MenuCreate;
import cn.dsc.jk.dto.menu.MenuDetail;
import cn.dsc.jk.dto.menu.MenuItem;
import cn.dsc.jk.dto.menu.MenuPageQuery;
import cn.dsc.jk.dto.menu.MenuUpdate;
import cn.dsc.jk.entity.MenuEntity;
import cn.dsc.jk.mapper.MenuMapper;
import cn.dsc.jk.service.MenuService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 菜单服务实现类
 *
 * @author ding.shichen
 */
@Service
public class MenuServiceImpl extends ServiceImpl<MenuMapper, MenuEntity> implements MenuService {

    @Override
    @Transactional
    public Long create(MenuCreate create) {
        MenuEntity entity = new MenuEntity();
        entity.setMenuName(create.getMenuName());
        entity.setMenuType(create.getMenuType());
        entity.setMenuFileName(create.getMenuFileName());
        entity.setMenuIcon(create.getMenuIcon());
        entity.setMenuRoute(create.getMenuRoute());
        entity.setPermissionId(create.getPermissionId());
        entity.setParentMenuId(create.getParentMenuId());
        this.save(entity);
        return entity.getMenuId();
    }

    @Override
    @Transactional
    public void update(Long menuId, MenuUpdate update) {
        MenuEntity entity = new MenuEntity();
        entity.setMenuId(menuId);
        entity.setMenuName(update.getMenuName());
        entity.setMenuType(update.getMenuType());
        entity.setMenuFileName(update.getMenuFileName());
        entity.setMenuIcon(update.getMenuIcon());
        entity.setMenuRoute(update.getMenuRoute());
        entity.setPermissionId(update.getPermissionId());
        entity.setParentMenuId(update.getParentMenuId());
        this.updateById(entity);
    }

    @Override
    @Transactional
    public void delete(Long menuId) {
        this.removeById(menuId);
    }

    @Override
    @Transactional
    public void deleteBatch(List<Long> menuIds) {
        this.removeBatchByIds(menuIds);
    }

    @Override
    public MenuDetail load(Long menuId) {
        return MenuConvert.FU_TO_DETAIL.apply(this.getById(menuId));
    }

    @Override
    public PageInfo<MenuItem> page(MenuPageQuery query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<MenuEntity> entities = this.baseMapper.selectList(
                query.getMenuName(),
                query.getMenuType(),
                query.getParentMenuId()
        );
        return new PageInfo<>(entities.stream().map(MenuConvert.FU_TO_ITEM).toList());
    }
}

