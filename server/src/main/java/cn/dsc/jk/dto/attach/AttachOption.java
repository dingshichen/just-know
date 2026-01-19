package cn.dsc.jk.dto.attach;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 附件选项DTO（用于UI标签、下拉选项）
 *
 * @author ding.shichen
 */
@Data
public class AttachOption implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 附件ID
     */
    private Long attachId;

    /**
     * 标题
     */
    private String title;
}
