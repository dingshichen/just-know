package cn.dsc.jk.config.mp;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;

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

    @Override
    public void insertFill(MetaObject metaObject) {
        LocalDateTime now = LocalDateTime.now();
        // Integer userId = AuthUtil.getUserId();
        // if (userId != null) {
        //     this.strictInsertFill(metaObject, CREATED_USER_ID, Integer.class, userId);
        //     this.strictUpdateFill(metaObject, UPDATED_USER_ID, Integer.class, userId);
        // }
        this.strictInsertFill(metaObject, CREATED_TIME, LocalDateTime.class, now);
        this.strictInsertFill(metaObject, UPDATED_TIME, LocalDateTime.class, now);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        // Integer userId = AuthUtil.getUserId();
        // if (userId != null) {
        //     this.strictUpdateFill(metaObject, UPDATED_USER_ID, Integer.class, userId);
        // }
        this.strictUpdateFill(metaObject, UPDATED_TIME, LocalDateTime.class, LocalDateTime.now());
    }

    @Override
    public MetaObjectHandler strictFillStrategy(MetaObject metaObject, String fieldName, Supplier<?> fieldVal) {
        if (!StrUtil.equals(CREATED_TIME, fieldName) || metaObject.getValue(fieldName) == null) {
            // 创建时间如若指定，则使用指定时间，保持批量插入数据或插入关联数据时，业务代码里可指定同一个时间
            metaObject.setValue(fieldName, fieldVal.get());
        }
        return this;
    }
}
