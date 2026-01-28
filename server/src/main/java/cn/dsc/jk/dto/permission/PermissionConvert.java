package cn.dsc.jk.dto.permission;

import java.util.function.Function;

import org.springframework.beans.BeanUtils;

import cn.dsc.jk.entity.PermissionEntity;

/**
 * 权限转换工具
 *
 * @author ding.shichen
 */
public abstract class PermissionConvert {

    public static Function<PermissionEntity, PermissionOption> FU_TO_OPTION = entity -> {
        if (entity == null) {
            return null;
        }
        PermissionOption option = new PermissionOption();
        BeanUtils.copyProperties(entity, option);
        return option;
    };

    public static Function<PermissionEntity, PermissionItem> FU_TO_ITEM = entity -> {
        if (entity == null) {
            return null;
        }
        PermissionItem item = new PermissionItem();
        BeanUtils.copyProperties(entity, item);
        return item;
    };

    public static Function<PermissionEntity, PermissionDetail> FU_TO_DETAIL = entity -> {
        if (entity == null) {
            return null;
        }
        PermissionDetail detail = new PermissionDetail();
        BeanUtils.copyProperties(entity, detail);
        return detail;
    };
}

