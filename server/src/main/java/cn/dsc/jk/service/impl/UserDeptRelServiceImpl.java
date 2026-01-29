package cn.dsc.jk.service.impl;

import cn.dsc.jk.dto.dept.DeptOption;
import cn.dsc.jk.entity.UserDeptRelEntity;
import cn.dsc.jk.mapper.UserDeptRelMapper;
import cn.dsc.jk.service.DeptService;
import cn.dsc.jk.service.UserDeptRelService;
import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * 用户机构关系服务实现类
 *
 * @author ding.shichen
 */
@Service
public class UserDeptRelServiceImpl extends ServiceImpl<UserDeptRelMapper, UserDeptRelEntity> implements UserDeptRelService {

    @Autowired
    private UserDeptRelMapper userDeptMapper;

    @Autowired
    private DeptService deptService;

    @Override
    public List<Long> getDeptIdsByUserId(Long userId) {
        return userDeptMapper.selectDeptIdsByUserId(userId);
    }

    @Override
    public List<Long> getUserIdsByDeptId(Long deptId) {
        return userDeptMapper.selectUserIdsByDeptId(deptId);
    }

    @Override
    public List<UserDeptRelEntity> getByUserIds(List<Long> userIds) {
        return userDeptMapper.selectByUserIds(userIds);
    }

    @Override
    public boolean deleteByUserId(Long userId) {
        return userDeptMapper.deleteByUserId(userId) > 0;
    }

    @Override
    public boolean deleteByDeptId(Long deptId) {
        return userDeptMapper.deleteByDeptId(deptId) > 0;
    }

    @Override
    public Map<Long, List<DeptOption>> listDeptOptionsMapByUserIds(List<Long> userIds) {
        // 查询用户机构关系列表
        List<UserDeptRelEntity> relEntities = userDeptMapper.selectByUserIds(userIds);
        if (CollUtil.isEmpty(relEntities)) {
            return new HashMap<>();
        }
        // 提取出所有机构ID
        List<Long> deptIds = relEntities.stream().map(UserDeptRelEntity::getDeptId).distinct().toList();
        // 查询机构选项列表
        Map<Long, DeptOption> deptOptionsMap = deptService.mapsByIds(deptIds);
        Map<Long, List<DeptOption>> result = new HashMap<>();
        // 按用户分组，组装机构选项列表
        relEntities.stream().collect(Collectors.groupingBy(UserDeptRelEntity::getUserId)).forEach((userId, userRelList) -> {
            List<DeptOption> deptOptions = userRelList.stream().map(e -> deptOptionsMap.get(e.getDeptId())).filter(Objects::nonNull).toList();
            result.put(userId, deptOptions);
        });
        return result;
    }
}
