package cn.dsc.jk.service.impl;

import cn.dsc.jk.dto.notice.NoticeConvert;
import cn.dsc.jk.dto.notice.NoticeCreate;
import cn.dsc.jk.dto.notice.NoticeDetail;
import cn.dsc.jk.dto.notice.NoticeItem;
import cn.dsc.jk.dto.notice.NoticePageQuery;
import cn.dsc.jk.dto.notice.NoticeUpdate;
import cn.dsc.jk.entity.NoticeEntity;
import cn.dsc.jk.entity.NoticeReadEntity;
import cn.dsc.jk.mapper.NoticeMapper;
import cn.dsc.jk.service.NoticeReadService;
import cn.dsc.jk.service.NoticeService;
import cn.dsc.jk.util.SecurityContextUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 公告服务实现类
 *
 * @author ding.shichen
 */
@Service
public class NoticeServiceImpl extends ServiceImpl<NoticeMapper, NoticeEntity> implements NoticeService {

    private static final String STATUS_PUBLISHED = "PUBLISHED";

    @Autowired
    private NoticeReadService noticeReadService;

    @Override
    @Transactional
    public Long create(NoticeCreate create) {
        NoticeEntity entity = new NoticeEntity();
        entity.setTitle(create.getTitle());
        entity.setContent(create.getContent());
        entity.setStartDate(create.getStartDate());
        entity.setEndDate(create.getEndDate());
        entity.setNoticeStatus(create.getNoticeStatus());
        this.save(entity);
        return entity.getNoticeId();
    }

    @Override
    @Transactional
    public void update(Long noticeId, NoticeUpdate update) {
        NoticeEntity entity = new NoticeEntity();
        entity.setNoticeId(noticeId);
        entity.setTitle(update.getTitle());
        entity.setContent(update.getContent());
        entity.setStartDate(update.getStartDate());
        entity.setEndDate(update.getEndDate());
        entity.setNoticeStatus(update.getNoticeStatus());
        this.updateById(entity);
    }

    @Override
    @Transactional
    public void publish(Long noticeId) {
        NoticeEntity entity = new NoticeEntity();
        entity.setNoticeId(noticeId);
        entity.setNoticeStatus(STATUS_PUBLISHED);
        this.updateById(entity);
    }

    @Override
    @Transactional
    public void delete(Long noticeId) {
        this.removeById(noticeId);
    }

    @Override
    @Transactional
    public void deleteBatch(List<Long> noticeIds) {
        this.removeBatchByIds(noticeIds);
    }

    @Override
    public NoticeDetail load(Long noticeId) {
        return NoticeConvert.FU_TO_DETAIL.apply(this.getById(noticeId));
    }

    @Override
    public PageInfo<NoticeItem> page(NoticePageQuery query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<NoticeEntity> entities = this.baseMapper.selectList(
                query.getTitle(),
                query.getNoticeStatus()
        );
        return new PageInfo<>(entities.stream().map(NoticeConvert.FU_TO_ITEM).toList());
    }

    @Override
    public List<NoticeDetail> listUnread() {
        Long userId = SecurityContextUtil.getUserId();
        List<NoticeEntity> entities = this.baseMapper.selectUnreadByUserId(userId);
        return entities.stream().map(NoticeConvert.FU_TO_DETAIL).toList();
    }

    @Override
    @Transactional
    public void read(Long noticeId) {
        Long userId = SecurityContextUtil.getUserId();
        NoticeReadEntity entity = new NoticeReadEntity();
        entity.setUserId(userId);
        entity.setNoticeId(noticeId);
        noticeReadService.save(entity);
    }
}

