package cn.dsc.jk.mapper;

import cn.dsc.jk.entity.NoticeEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 公告Mapper接口
 *
 * @author ding.shichen
 */
@Mapper
public interface NoticeMapper extends BaseMapper<NoticeEntity> {

    /**
     * 分页查询列表
     *
     * @param title        标题（可选，模糊查询）
     * @param noticeStatus 公告状态（可选）
     * @return 公告列表
     */
    List<NoticeEntity> selectList(@Param("title") String title,
                                  @Param("noticeStatus") String noticeStatus);

    /**
     * 查询指定用户的未读公告列表
     *
     * @param userId 用户ID
     * @return 未读公告列表
     */
    List<NoticeEntity> selectUnreadByUserId(@Param("userId") Long userId);
}

