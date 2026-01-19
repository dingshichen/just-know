package cn.dsc.jk.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;
import com.github.pagehelper.PageInfo;

import cn.dsc.jk.dto.attach.AttachDetail;
import cn.dsc.jk.dto.attach.AttachItem;
import cn.dsc.jk.dto.attach.AttachPageQuery;
import cn.dsc.jk.entity.AttachEntity;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

/**
 * 附件服务接口
 *
 * @author ding.shichen
 */
public interface AttachService extends IService<AttachEntity> {

    /**
     * 上传附件
     *
     * @param file 文件
     * @return 附件详情
     */
    AttachDetail upload(MultipartFile file);

    /**
     * 下载附件
     *
     * @param attachId 附件ID
     * @return 文件资源
     */
    Resource download(Long attachId);

    /**
     * 根据ID查询附件详情
     *
     * @param attachId 附件ID
     * @return 附件详情
     */
    AttachDetail load(Long attachId);

    /**
     * 分页查询附件列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    PageInfo<AttachItem> page(AttachPageQuery query);

    /**
     * 删除附件
     *
     * @param attachId 附件ID
     */
    void delete(Long attachId);

    /**
     * 批量删除附件
     *
     * @param attachIds 附件ID列表
     */
    void deleteBatch(List<Long> attachIds);
}
