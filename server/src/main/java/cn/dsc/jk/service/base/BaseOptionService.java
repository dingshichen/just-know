package cn.dsc.jk.service.base;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.stream.Collectors;

import cn.dsc.jk.common.IBase;
import cn.hutool.core.collection.CollUtil;

/**
 * 填充选项，O 代表填充的属性
 * 
 * @author ding.shichen
 */
public interface BaseOptionService<O extends IBase> {

    /**
     * 根据 ID 列表查询选项。
     * @param ids
     * @return
     */
    List<O> selectByIds(List<Long> ids);

    /**
     * 根据 ID 列表查询选项映射。
     * @param ids
     * @return
     */
    default Map<Long, O> mapsByIds(List<Long> ids) {
        return this.selectByIds(ids).stream().collect(Collectors.toMap(IBase::getId, Function.identity()));
    }

    /**
     * 填充单个属性。
     * @param sourceList 需要填充的源数据列表
     * @param getOption 获取待填充属性的函数
     * @param setOption 保存填充属性的函数
     */
    default <E> void fill(List<E> sourceList, Function<E, O> getOption, BiConsumer<E, O> setOption) {
        if (CollUtil.isEmpty(sourceList)) {
            return;
        }
        List<Long> ids = sourceList.stream()
            .map(getOption)
            .filter(Objects::nonNull)
            .map(O::getId)
            .filter(Objects::nonNull)
            .distinct()
            .toList();
        if (CollUtil.isEmpty(ids)) {
            return;
        }
        List<O> resultOptions = this.selectByIds(ids);
        if (CollUtil.isEmpty(resultOptions)) {
            return;
        }
        Map<Long, O> resultMap = resultOptions.stream().collect(Collectors.toMap(IBase::getId, Function.identity()));
        for (E source : sourceList) {
            O option = getOption.apply(source);
            if (option == null) {
                continue;
            }
            Long id = option.getId();
            if (id == null) {
                continue;
            }
            O result = resultMap.get(id);
            if (result == null) {
                continue;
            }
            setOption.accept(source, result);
        }
    }

}
