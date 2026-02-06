package cn.dsc.jk.service.impl;

import cn.dsc.jk.entity.NoticeReadEntity;
import cn.dsc.jk.mapper.NoticeReadMapper;
import cn.dsc.jk.service.NoticeReadService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * 公告阅读服务实现类
 *
 * @author ding.shichen
 */
@Service
public class NoticeReadServiceImpl extends ServiceImpl<NoticeReadMapper, NoticeReadEntity> implements NoticeReadService {
}

