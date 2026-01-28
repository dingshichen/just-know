package cn.dsc.jk.dto.dept;

import java.util.function.Function;

import org.springframework.beans.BeanUtils;

import cn.dsc.jk.entity.DeptEntity;

/**
 * @author ding.shichen
 */
public abstract class DeptConvert {

    public static Function<DeptEntity, DeptOption> FU_TO_OPTION = entity -> {
        if (entity == null) {
            return null;
        }
        DeptOption option = new DeptOption();
        BeanUtils.copyProperties(entity, option);
        return option;
    };

    public static Function<DeptEntity, DeptItem> FU_TO_ITEM = entity -> {
        if (entity == null) {
            return null;
        }
        DeptItem item = new DeptItem();
        BeanUtils.copyProperties(entity, item);
        return item;
    };

    public static Function<DeptEntity, DeptDetail> FU_TO_DETAIL = entity -> {
        if (entity == null) {
            return null;
        }
        DeptDetail detail = new DeptDetail();
        BeanUtils.copyProperties(entity, detail);
        return detail;
    };
}
