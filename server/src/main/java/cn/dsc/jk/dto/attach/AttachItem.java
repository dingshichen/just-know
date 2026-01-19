package cn.dsc.jk.dto.attach;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 附件列表项DTO（用于UI表格、列表）
 *
 * @author ding.shichen
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AttachItem extends AttachOption {

    /**
     * 存储类型
     */
    private String storageType;

    /**
     * 附件类型
     */
    private String attachType;

    /**
     * 附件URL
     */
    private String attachUrl;

    /**
     * 附件大小(KB)
     */
    private Long attachSize;

    /**
     * 创建时间
     */
    private LocalDateTime createdTime;

    /**
     * 更新时间
     */
    private LocalDateTime updatedTime;
}
