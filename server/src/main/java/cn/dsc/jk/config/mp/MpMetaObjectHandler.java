package cn.dsc.jk.config.mp;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;

import cn.dsc.jk.util.SecurityContextUtil;
import cn.hutool.core.util.StrUtil;

import org.apache.ibatis.reflection.MetaObject;

import java.time.LocalDateTime;
import java.util.function.Supplier;

/**
 * @author ding.shichen
 */
public class MpMetaObjectHandler implements MetaObjectHandler {

    private static final String CREATED_USER_ID = "createdUserId";
    private static final String UPDATED_USER_ID = "updatedUserId";
    private static final String CREATED_TIME = "createdTime";
    private static final String UPDATED_TIME = "updatedTime";

    /**
     * 使用 MybatisPlus 的 insertFill 方法，自动填充创建时间和更新时间，以及创建用户和更新用户。
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        LocalDateTime now = LocalDateTime.now();
        Long userId = SecurityContextUtil.getUserId();
        if (userId != null) {
            this.strictInsertFill(metaObject, CREATED_USER_ID, Long.class, userId);
            this.strictUpdateFill(metaObject, UPDATED_USER_ID, Long.class, userId);
        }
        this.strictInsertFill(metaObject, CREATED_TIME, LocalDateTime.class, now);
        this.strictInsertFill(metaObject, UPDATED_TIME, LocalDateTime.class, now);
    }

    /**
     * 使用 MybatisPlus 的 updateFill 方法，自动填充更新时间，以及更新用户。
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        Long userId = SecurityContextUtil.getUserId();
        if (userId != null) {
            this.strictUpdateFill(metaObject, UPDATED_USER_ID, Long.class, userId);
        }
        this.strictUpdateFill(metaObject, UPDATED_TIME, LocalDateTime.class, LocalDateTime.now());
    }

    /**
     * 使用 MybatisPlus 的 strictFillStrategy 方法，如果创建时间未指定，则使用当前时间。
     */
    @Override
    public MetaObjectHandler strictFillStrategy(MetaObject metaObject, String fieldName, Supplier<?> fieldVal) {
        if (!StrUtil.equals(CREATED_TIME, fieldName) || metaObject.getValue(fieldName) == null) {
            // 创建时间如若指定，则使用指定时间，保持批量插入数据或插入关联数据时，业务代码里可指定同一个时间
            metaObject.setValue(fieldName, fieldVal.get());
        }
        return this;
    }
}
