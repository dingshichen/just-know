package cn.dsc.jk.service.impl;

import cn.dsc.jk.consts.AttachStorageType;
import cn.dsc.jk.dto.attach.AttachConvert;
import cn.dsc.jk.dto.attach.AttachDetail;
import cn.dsc.jk.dto.attach.AttachItem;
import cn.dsc.jk.dto.attach.AttachOption;
import cn.dsc.jk.dto.attach.AttachPageQuery;
import cn.dsc.jk.dto.attach.AttachStats;
import cn.dsc.jk.entity.AttachEntity;
import cn.dsc.jk.exception.BizException;
import cn.dsc.jk.mapper.AttachMapper;
import cn.dsc.jk.service.AttachService;
import cn.hutool.core.util.IdUtil;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 附件服务实现类
 *
 * @author ding.shichen
 */
@Slf4j
@Service
public class AttachServiceImpl extends ServiceImpl<AttachMapper, AttachEntity> implements AttachService {

    /**
     * 文件上传基础路径（可根据实际情况配置）
     */
    private static final String UPLOAD_DIR = "uploads";

    @Override
    public AttachOption getOptionById(Long attachId) {
        AttachEntity entity = this.getById(attachId);
        if (entity == null) {
            return null;
        }
        return AttachConvert.FU_TO_OPTION.apply(entity);
    }

    @Override
    public List<AttachOption> selectByIds(List<Long> attachIds) {
        return this.listByIds(attachIds).stream().map(AttachConvert.FU_TO_OPTION).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AttachDetail upload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("文件不能为空");
        }
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new RuntimeException("文件名不能为空");
        }
        if (!originalFilename.contains(".")) {
            throw new RuntimeException("文件名必须包含扩展名");
        }
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));

        try {

            // 生成文件key
            String attachKey = generateAttachKey(fileExtension);
            String title = originalFilename != null ? originalFilename : "未知文件";

            // 保存文件到本地（这里简化处理，实际应根据storageType选择不同的存储方式）
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(attachKey + fileExtension);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 创建附件实体
            AttachEntity entity = new AttachEntity();
            entity.setTitle(title);
            entity.setStorageType(AttachStorageType.LOCAL.name());
            entity.setAttachType(fileExtension);
            entity.setAttachKey(attachKey);
            entity.setAttachSize(file.getSize() / 1024); // 转换为KB
            // 保存到数据库
            this.save(entity);

            // 构建附件URL（在获取attachId后）
            String attachUrl = "/api/attach/download/" + entity.getAttachId();
            entity.setAttachUrl(attachUrl);
            this.updateById(entity);

            // 转换为DTO
            return AttachConvert.FU_TO_DETAIL.apply(entity);

        } catch (IOException e) {
            log.error("文件上传失败", e);
            throw new BizException("文件上传失败: " + e.getMessage());
        }
    }

    @Override
    public Resource download(Long attachId) {
        AttachEntity entity = this.getById(attachId);
        if (entity == null) {
            throw new BizException("附件不存在");
        }

        try {
            // 根据attachKey和attachType（文件扩展名）构建文件路径
            Path uploadPath = Paths.get(UPLOAD_DIR);
            Path filePath = uploadPath.resolve(entity.getAttachKey() + entity.getAttachType());
            
            if (!Files.exists(filePath)) {
                throw new BizException("文件不存在");
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new BizException("文件不可读");
            }
        } catch (IOException e) {
            log.error("文件下载失败", e);
            throw new BizException("文件下载失败: " + e.getMessage());
        }
    }

    @Override
    public AttachDetail load(Long attachId) {
        AttachEntity entity = this.getById(attachId);
        if (entity == null) {
            return null;
        }
        return AttachConvert.FU_TO_DETAIL.apply(entity);
    }

    @Override
    public PageInfo<AttachItem> page(AttachPageQuery query) {
        PageHelper.startPage(query.getPageNum(), query.getPageSize());
        List<AttachEntity> entities = this.baseMapper.selectList(query.getTitle(), 
                query.getStorageType(), query.getAttachType());

        return new PageInfo<>(entities.stream().map(AttachConvert.FU_TO_ITEM).collect(Collectors.toList()));
    }

    @Override
    @Transactional
    public void delete(Long attachId) {
        AttachEntity entity = this.getById(attachId);
        if (entity == null) {
            return;
        }

        // 删除文件
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            Path filePath = uploadPath.resolve(entity.getAttachKey() + entity.getAttachType());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException e) {
            log.error("删除文件失败", e);
        }

        // 删除数据库记录
        this.removeById(attachId);
    }

    @Override
    @Transactional
    public void deleteBatch(List<Long> attachIds) {
        if (attachIds == null || attachIds.isEmpty()) {
            return;
        }

        // 查询所有附件信息，用于删除文件
        List<AttachEntity> entities = attachIds.stream()
                .map(this::getById)
                .filter(entity -> entity != null)
                .collect(Collectors.toList());

        // 删除文件
        Path uploadPath = Paths.get(UPLOAD_DIR);
        for (AttachEntity entity : entities) {
            try {
                Path filePath = uploadPath.resolve(entity.getAttachKey() + entity.getAttachType());
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                }
            } catch (IOException e) {
                log.error("删除文件失败: {}", entity.getAttachId(), e);
            }
        }

        // 批量删除数据库记录
        this.removeBatchByIds(attachIds);
    }

    @Override
    public AttachStats stats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfWeek = now.toLocalDate().with(DayOfWeek.MONDAY).atStartOfDay();
        LocalDateTime startOfMonth = now.toLocalDate().withDayOfMonth(1).atStartOfDay();
        LocalDateTime startOfYear = now.toLocalDate().withDayOfYear(1).atStartOfDay();

        long total = this.count();
        long todayCount = this.count(new QueryWrapper<AttachEntity>().ge("created_time", startOfToday));
        long weekCount = this.count(new QueryWrapper<AttachEntity>().ge("created_time", startOfWeek));
        long monthCount = this.count(new QueryWrapper<AttachEntity>().ge("created_time", startOfMonth));
        long yearCount = this.count(new QueryWrapper<AttachEntity>().ge("created_time", startOfYear));

        AttachStats stats = new AttachStats();
        stats.setTotal(total);
        stats.setTodayCount(todayCount);
        stats.setWeekCount(weekCount);
        stats.setMonthCount(monthCount);
        stats.setYearCount(yearCount);
        return stats;
    }

    /**
     * 生成附件key
     * 
     * @param fileExtension 文件扩展名
     * @return 附件key
     */
    private String generateAttachKey(String fileExtension) {
        return IdUtil.getSnowflakeNextIdStr() + fileExtension;
    }
}
