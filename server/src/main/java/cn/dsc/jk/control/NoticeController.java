package cn.dsc.jk.control;

import cn.dsc.jk.common.Result;
import cn.dsc.jk.dto.notice.NoticeCreate;
import cn.dsc.jk.dto.notice.NoticeDetail;
import cn.dsc.jk.dto.notice.NoticeItem;
import cn.dsc.jk.dto.notice.NoticePageQuery;
import cn.dsc.jk.dto.notice.NoticeUpdate;
import cn.dsc.jk.service.NoticeService;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 公告控制器
 *
 * @author ding.shichen
 */
@RestController
@RequestMapping("/notice")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    /**
     * 分页查询公告列表
     *
     * @param query 查询条件
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<PageInfo<NoticeItem>> page(NoticePageQuery query) {
        PageInfo<NoticeItem> pageInfo = noticeService.page(query);
        return Result.success(pageInfo);
    }

    /**
     * 根据ID查询公告详情
     *
     * @param noticeId 公告ID
     * @return 公告详情
     */
    @GetMapping("/{noticeId}")
    public Result<NoticeDetail> load(@PathVariable Long noticeId) {
        NoticeDetail detail = noticeService.load(noticeId);
        return Result.success(detail);
    }

    /**
     * 查询当前用户未读公告列表
     *
     * @return 未读公告详情列表
     */
    @GetMapping("/unread")
    public Result<List<NoticeDetail>> listUnread() {
        List<NoticeDetail> list = noticeService.listUnread();
        return Result.success(list);
    }

    /**
     * 新增公告
     *
     * @param create 新增公告请求
     * @return 公告ID
     */
    @PostMapping
    public Result<Long> create(@RequestBody NoticeCreate create) {
        Long noticeId = noticeService.create(create);
        return Result.success(noticeId);
    }

    /**
     * 修改公告
     *
     * @param noticeId 公告ID
     * @param update   修改公告请求
     * @return 操作结果
     */
    @PutMapping("/{noticeId}")
    public Result<?> update(@PathVariable Long noticeId, @RequestBody NoticeUpdate update) {
        noticeService.update(noticeId, update);
        return Result.success();
    }

    /**
     * 发布公告
     *
     * @param noticeId 公告ID
     * @return 操作结果
     */
    @PostMapping("/{noticeId}/publish")
    public Result<?> publish(@PathVariable Long noticeId) {
        noticeService.publish(noticeId);
        return Result.success();
    }

    /**
     * 记录当前用户已阅读指定公告
     *
     * @param noticeId 公告ID
     * @return 操作结果
     */
    @PostMapping("/{noticeId}/read")
    public Result<?> read(@PathVariable Long noticeId) {
        noticeService.read(noticeId);
        return Result.success();
    }

    /**
     * 删除公告
     *
     * @param noticeId 公告ID
     * @return 操作结果
     */
    @DeleteMapping("/{noticeId}")
    public Result<?> delete(@PathVariable Long noticeId) {
        noticeService.delete(noticeId);
        return Result.success();
    }

    /**
     * 批量删除公告
     *
     * @param noticeIds 公告ID列表
     * @return 操作结果
     */
    @DeleteMapping("/batch")
    public Result<?> deleteBatch(@RequestParam("noticeIds") List<Long> noticeIds) {
        noticeService.deleteBatch(noticeIds);
        return Result.success();
    }
}

