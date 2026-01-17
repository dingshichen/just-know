package cn.dsc.jk.common;

import lombok.Setter;

/**
 * @author ding.shichen
 */
@Setter
public class PageQuery {

    private static final int MAX_SIZE = 1000;

    private int pageNum = 1;
    private int pageSize = 10;

    public int getPageNum() {
        return pageNum;
    }

    public int getPageSize() {
        return Math.min(pageSize, MAX_SIZE);
    }
}
