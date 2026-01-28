package cn.dsc.jk.common;

import java.beans.Transient;

/**
 * @author ding.shichen
 */
public interface IBase {

    /**
     * 获取主键ID
     * @return 主键ID
     */
    @Transient
    Long getId();
}
