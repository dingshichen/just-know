package cn.dsc.jk.config.mvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author ding.shichen
 */
@Configuration
@EnableConfigurationProperties(ServerLoggingProperties.class)
public class WebMvcConfiguration {

    @Bean
    public JacksonCustomizer jackson2ObjectMapperBuilder() {
        return new JacksonCustomizer();
    }

    @Bean
    public ServerLoggingFilter serverLoggingFilter(ObjectMapper objectMapper, ServerLoggingProperties loggingProperties) {
        return new ServerLoggingFilter(objectMapper, loggingProperties);
    }
}