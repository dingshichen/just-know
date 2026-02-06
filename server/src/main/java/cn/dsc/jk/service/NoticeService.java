package cn.dsc.jk.service;

import cn.dsc.jk.dto.notice.NoticeCreate;
import cn.dsc.jk.dto.notice.NoticeDetail;
import cn.dsc.jk.dto.notice.NoticeItem;
import cn.dsc.jk.dto.notice.NoticePageQuery;
import cn.dsc.jk.dto.notice.NoticeUpdate;
import cn.dsc.jk.entity.NoticeEntity;
import com.baomidou.mybatisplus.extension.service.IService;
import com.github.pagehelper.PageInfo;

import java.util.List;

/**
 * 公告服务接口
 *
 * @author ding.shichen
 */
public interface NoticeService extends IService<NoticeEntity> {

    /**
     * 新增公告
     *
     * @param create 新增公告请求
     * @return 公告ID
     */
    Long create(NoticeCreate create);

    /**
     * 修改公告
     *
     * @param noticeId 公告ID
     * @param update   修改公告请求
     */
    void update(Long noticeId, NoticeUpdate update);

    /**
     * 发布公告
     *
     * @param noticeId 公告ID
     */
    void publish(Long noticeId);

    /**
     * 删除公告
     *
     * @param noticeId 公告ID
     */
    void delete(Long noticeId);

    /**
     * 批量删除公告
     *
     * @param noticeIds 公告ID列表
     */
    void deleteBatch(List<Long> noticeIds);

    /**
     * 根据ID查询公告详情
     *
     * @param noticeId 公告ID
     * @return 公告详情
     */
    NoticeDetail load(Long noticeId);

    /**
     * 分页查询公告列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    PageInfo<NoticeItem> page(NoticePageQuery query);

    /**
     * 查询当前用户未读公告列表
     *
     * @return 未读公告详情列表
     */
    List<NoticeDetail> listUnread();

    /**
     * 记录当前用户已阅读指定公告
     *
     * @param noticeId 公告ID
     */
    void read(Long noticeId);
}

