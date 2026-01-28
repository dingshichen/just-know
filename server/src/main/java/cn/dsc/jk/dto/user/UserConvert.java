package cn.dsc.jk.dto.user;

import java.util.function.Function;

import org.springframework.beans.BeanUtils;

import cn.dsc.jk.entity.UserEntity;

/**
 * 用户转换工具
 *
 * @author ding.shichen
 */
public abstract class UserConvert {

    public static Function<UserEntity, UserOption> FU_TO_OPTION = entity -> {
        if (entity == null) {
            return null;
        }
        UserOption option = new UserOption();
        BeanUtils.copyProperties(entity, option);
        return option;
    };

    public static Function<UserEntity, UserItem> FU_TO_ITEM = entity -> {
        if (entity == null) {
            return null;
        }
        UserItem item = new UserItem();
        BeanUtils.copyProperties(entity, item);
        return item;
    };

    public static Function<UserEntity, UserDetail> FU_TO_DETAIL = entity -> {
        if (entity == null) {
            return null;
        }
        UserDetail detail = new UserDetail();
        BeanUtils.copyProperties(entity, detail);
        return detail;
    };
}

