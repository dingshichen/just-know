package cn.dsc.jk.config.mp;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author ding.shichen
 */
@Configuration
public class MybatisPlusConfiguration {

    @Bean
    public MpMetaObjectHandler metaObjectHandler() {
        return new MpMetaObjectHandler();
    }

}
