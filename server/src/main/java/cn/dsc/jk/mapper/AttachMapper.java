package cn.dsc.jk.mapper;

import cn.dsc.jk.entity.AttachEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

/**
 * 附件Mapper接口
 *
 * @author ding.shichen
 */
@Mapper
public interface AttachMapper extends BaseMapper<AttachEntity> {

    /**
     * 分页查询列表
     *
     * @param title 标题（可选）
     * @param storageType 存储类型（可选）
     * @param attachType 附件类型（可选）
     * @return 附件列表
     */
    List<AttachEntity> selectList(@Param("title") String title,
                                   @Param("storageType") String storageType,
                                   @Param("attachType") String attachType);

    /**
     * 插入记录
     *
     * @param entity 附件实体
     * @return 影响行数
     */
    int insert(AttachEntity entity);

    /**
     * 根据主键更新
     *
     * @param entity 附件实体
     * @return 影响行数
     */
    int updateById(AttachEntity entity);

    /**
     * 根据主键删除
     *
     * @param attachId 附件ID
     * @return 影响行数
     */
    int deleteById(@Param("attachId") Long attachId);

    /**
     * 批量删除
     *
     * @param attachIds 附件ID列表
     * @return 影响行数
     */
    int deleteByIds(@Param("attachIds") List<Long> attachIds);
}
