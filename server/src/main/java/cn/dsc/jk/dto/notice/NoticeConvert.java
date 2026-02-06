package cn.dsc.jk.dto.notice;

import cn.dsc.jk.entity.NoticeEntity;
import org.springframework.beans.BeanUtils;

import java.util.function.Function;

/**
 * 公告转换工具
 *
 * @author ding.shichen
 */
public abstract class NoticeConvert {

    public static Function<NoticeEntity, NoticeOption> FU_TO_OPTION = entity -> {
        if (entity == null) {
            return null;
        }
        NoticeOption option = new NoticeOption();
        BeanUtils.copyProperties(entity, option);
        return option;
    };

    public static Function<NoticeEntity, NoticeItem> FU_TO_ITEM = entity -> {
        if (entity == null) {
            return null;
        }
        NoticeItem item = new NoticeItem();
        BeanUtils.copyProperties(entity, item);
        return item;
    };

    public static Function<NoticeEntity, NoticeDetail> FU_TO_DETAIL = entity -> {
        if (entity == null) {
            return null;
        }
        NoticeDetail detail = new NoticeDetail();
        BeanUtils.copyProperties(entity, detail);
        return detail;
    };
}

