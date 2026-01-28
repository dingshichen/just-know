package cn.dsc.jk.dto.attach;

import java.util.function.Function;

import org.springframework.beans.BeanUtils;

import cn.dsc.jk.entity.AttachEntity;

/**
 * 附件转换工具
 *
 * @author ding.shichen
 */
public abstract class AttachConvert {

    public static Function<AttachEntity, AttachOption> FU_TO_OPTION = entity -> {
        if (entity == null) {
            return null;
        }
        AttachOption option = new AttachOption();
        BeanUtils.copyProperties(entity, option);
        return option;
    };

    public static Function<AttachEntity, AttachItem> FU_TO_ITEM = entity -> {
        if (entity == null) {
            return null;
        }
        AttachItem item = new AttachItem();
        BeanUtils.copyProperties(entity, item);
        return item;
    };

    public static Function<AttachEntity, AttachDetail> FU_TO_DETAIL = entity -> {
        if (entity == null) {
            return null;
        }
        AttachDetail detail = new AttachDetail();
        BeanUtils.copyProperties(entity, detail);
        return detail;
    };
}

