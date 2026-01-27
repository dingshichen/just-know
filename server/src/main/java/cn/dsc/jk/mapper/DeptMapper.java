package cn.dsc.jk.mapper;

import cn.dsc.jk.entity.DeptEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 机构Mapper接口
 *
 * @author ding.shichen
 */
@Mapper
public interface DeptMapper extends BaseMapper<DeptEntity> {

    /**
     * 分页查询列表
     *
     * @param deptName 机构名称（可选）
     * @param deptCode 机构编码（可选）
     * @param parentDeptId 父级机构ID（可选）
     * @return 机构列表
     */
    List<DeptEntity> selectList(@Param("deptName") String deptName,
                                @Param("deptCode") String deptCode,
                                @Param("parentDeptId") Long parentDeptId);

    /**
     * 查询所有机构（用于树形结构）
     *
     * @return 机构列表
     */
    List<DeptEntity> selectAll();

    /**
     * 根据父级机构ID查询子机构列表
     *
     * @param parentDeptId 父级机构ID
     * @return 子机构列表
     */
    List<DeptEntity> selectByParentDeptId(@Param("parentDeptId") Long parentDeptId);
}
