package cn.dsc.jk.config.mvc;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author ding.shichen
 */
@Configuration
public class WebMvcConfiguration {

    @Bean
    public JacksonCustomizer jackson2ObjectMapperBuilder() {
        return new JacksonCustomizer();
    }

    @Bean
    public ServerLoggingFilter serverLoggingFilter(ObjectMapper objectMapper) {
        return new ServerLoggingFilter(objectMapper);
    }
}