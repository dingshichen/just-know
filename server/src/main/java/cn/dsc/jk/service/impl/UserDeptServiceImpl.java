package cn.dsc.jk.service.impl;

import cn.dsc.jk.entity.UserDeptRelEntity;
import cn.dsc.jk.mapper.UserDeptMapper;
import cn.dsc.jk.service.UserDeptService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 用户机构关系服务实现类
 *
 * @author ding.shichen
 */
@Service
public class UserDeptServiceImpl extends ServiceImpl<UserDeptMapper, UserDeptRelEntity> implements UserDeptService {

    @Autowired
    private UserDeptMapper userDeptMapper;

    @Override
    public List<Long> getDeptIdsByUserId(Long userId) {
        return userDeptMapper.selectDeptIdsByUserId(userId);
    }

    @Override
    public List<Long> getUserIdsByDeptId(Long deptId) {
        return userDeptMapper.selectUserIdsByDeptId(deptId);
    }

    @Override
    public boolean deleteByUserId(Long userId) {
        return userDeptMapper.deleteByUserId(userId) > 0;
    }

    @Override
    public boolean deleteByDeptId(Long deptId) {
        return userDeptMapper.deleteByDeptId(deptId) > 0;
    }
}
