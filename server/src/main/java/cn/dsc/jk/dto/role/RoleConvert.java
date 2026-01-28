package cn.dsc.jk.dto.role;

import java.util.function.Function;

import org.springframework.beans.BeanUtils;

import cn.dsc.jk.entity.RoleEntity;

/**
 * 角色转换工具
 *
 * @author ding.shichen
 */
public abstract class RoleConvert {

    public static Function<RoleEntity, RoleOption> FU_TO_OPTION = entity -> {
        if (entity == null) {
            return null;
        }
        RoleOption option = new RoleOption();
        BeanUtils.copyProperties(entity, option);
        return option;
    };

    public static Function<RoleEntity, RoleItem> FU_TO_ITEM = entity -> {
        if (entity == null) {
            return null;
        }
        RoleItem item = new RoleItem();
        BeanUtils.copyProperties(entity, item);
        return item;
    };

    public static Function<RoleEntity, RoleDetail> FU_TO_DETAIL = entity -> {
        if (entity == null) {
            return null;
        }
        RoleDetail detail = new RoleDetail();
        BeanUtils.copyProperties(entity, detail);
        return detail;
    };
}

