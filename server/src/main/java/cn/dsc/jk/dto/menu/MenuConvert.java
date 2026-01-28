package cn.dsc.jk.dto.menu;

import java.util.function.Function;

import org.springframework.beans.BeanUtils;

import cn.dsc.jk.entity.MenuEntity;

/**
 * 菜单转换工具
 *
 * @author ding.shichen
 */
public abstract class MenuConvert {

    public static Function<MenuEntity, MenuItem> FU_TO_ITEM = entity -> {
        if (entity == null) {
            return null;
        }
        MenuItem item = new MenuItem();
        BeanUtils.copyProperties(entity, item);
        return item;
    };

    public static Function<MenuEntity, MenuDetail> FU_TO_DETAIL = entity -> {
        if (entity == null) {
            return null;
        }
        MenuDetail detail = new MenuDetail();
        BeanUtils.copyProperties(entity, detail);
        return detail;
    };
}

