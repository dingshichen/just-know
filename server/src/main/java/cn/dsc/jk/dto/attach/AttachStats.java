package cn.dsc.jk.dto.attach;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 附件统计 DTO
 *
 * @author ding.shichen
 */
@Data
public class AttachStats implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 附件总数
     */
    private long total;

    /**
     * 今日上传总数
     */
    private long todayCount;

    /**
     * 本周上传总数
     */
    private long weekCount;

    /**
     * 本月上传总数
     */
    private long monthCount;

    /**
     * 本年度上传总数
     */
    private long yearCount;
}
