package cn.dsc.jk.dto.user;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 用户选项DTO（用于UI标签、下拉选项）
 *
 * @author ding.shichen
 */
@Data
public class UserOption implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 用户姓名
     */
    private String userName;
}
