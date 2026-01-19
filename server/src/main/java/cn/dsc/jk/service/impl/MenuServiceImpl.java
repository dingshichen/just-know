package cn.dsc.jk.service.impl;

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
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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
        BeanUtils.copyProperties(create, entity);
        this.save(entity);
        return entity.getMenuId();
    }

    @Override
    @Transactional
    public void update(Long menuId, MenuUpdate update) {
        MenuEntity entity = new MenuEntity();
        entity.setMenuId(menuId);
        BeanUtils.copyProperties(update, entity);
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
        MenuEntity entity = this.getById(menuId);
        if (entity == null) {
            return null;
        }

        MenuDetail detail = new MenuDetail();
        BeanUtils.copyProperties(entity, detail);
        return detail;
    }

    @Override
    public PageInfo<MenuItem> page(MenuPageQuery query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<MenuEntity> entities = this.baseMapper.selectList(
                query.getMenuName(),
                query.getMenuType(),
                query.getParentMenuId()
        );

        List<MenuItem> items = entities.stream().map(entity -> {
            MenuItem item = new MenuItem();
            BeanUtils.copyProperties(entity, item);
            return item;
        }).collect(Collectors.toList());

        return new PageInfo<>(items);
    }
}
