package cn.dsc.jk.control;

import cn.dsc.jk.common.Result;
import cn.dsc.jk.dto.attach.AttachDetail;
import cn.dsc.jk.dto.attach.AttachItem;
import cn.dsc.jk.dto.attach.AttachPageQuery;
import cn.dsc.jk.dto.attach.AttachStats;
import cn.dsc.jk.service.AttachService;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 附件控制器
 *
 * @author ding.shichen
 */
@RestController
@RequestMapping("/attach")
@RequiredArgsConstructor
public class AttachController {

    private final AttachService attachService;

    /**
     * 上传附件
     *
     * @param file 文件
     * @param storageType 存储类型
     * @param attachType 附件类型
     * @return 附件详情
     */
    @PostMapping
    public Result<AttachDetail> upload(@RequestParam("file") MultipartFile file) {
        AttachDetail detail = attachService.upload(file);
        return Result.success(detail);
    }

    /**
     * 下载附件
     *
     * @param attachId 附件ID
     * @return 文件资源
     */
    @GetMapping("/download/{attachId}")
    public ResponseEntity<Resource> download(@PathVariable Long attachId) {
        Resource resource = attachService.download(attachId);
        AttachDetail detail = attachService.load(attachId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + detail.getTitle() + "\"")
                .body(resource);
    }

    /**
     * 根据ID查询附件详情
     *
     * @param attachId 附件ID
     * @return 附件详情
     */
    @GetMapping("/{attachId}")
    public Result<AttachDetail> load(@PathVariable Long attachId) {
        AttachDetail detail = attachService.load(attachId);
        return Result.success(detail);
    }

    /**
     * 分页查询附件列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<PageInfo<AttachItem>> page(AttachPageQuery query) {
        PageInfo<AttachItem> pageInfo = attachService.page(query);
        return Result.success(pageInfo);
    }

    /**
     * 查询附件统计
     *
     * @return 附件总数、今日/本周/本月/本年度上传总数
     */
    @GetMapping("/stats")
    public Result<AttachStats> stats() {
        AttachStats stats = attachService.stats();
        return Result.success(stats);
    }

    /**
     * 删除附件
     *
     * @param attachId 附件ID
     * @param updatedUserId 更新用户ID（实际应用中应从认证信息中获取）
     * @return 操作结果
     */
    @DeleteMapping("/{attachId}")
    public Result<?> delete(@PathVariable Long attachId) {
        attachService.delete(attachId);
        return Result.success();
    }

    /**
     * 批量删除附件
     *
     * @param attachIds 附件ID列表
     * @param updatedUserId 更新用户ID（实际应用中应从认证信息中获取）
     * @return 操作结果
     */
    @DeleteMapping("/batch")
    public Result<?> deleteBatch(@RequestBody List<Long> attachIds) {
        attachService.deleteBatch(attachIds);
        return Result.success();
    }
}
