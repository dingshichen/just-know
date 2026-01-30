package cn.dsc.jk.config.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.codec.JsonJacksonCodec;
import org.redisson.config.Config;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.StringUtils;

/**
 * Redisson 配置类
 * 配置 Redisson 使用 Jackson 进行序列化和反序列化
 *
 * @author ding.shichen
 */
@Configuration
public class RedissonConfiguration {

    /**
     * 配置 RedissonClient，使用 Jackson 编解码器
     *
     * @param redisProperties Redis 配置属性
     * @param objectMapper Jackson ObjectMapper（已配置 LocalDateTime 序列化）
     * @return RedissonClient 实例
     */
    @Bean(destroyMethod = "shutdown")
    @Primary
    public RedissonClient redissonClient(RedisProperties redisProperties, ObjectMapper objectMapper) {
        Config config = new Config();
        
        // 使用单节点模式
        String address = "redis://" + redisProperties.getHost() + ":" + redisProperties.getPort();
        config.useSingleServer()
                .setAddress(address)
                .setDatabase(redisProperties.getDatabase());
        
        // 设置密码（如果有）
        if (StringUtils.hasText(redisProperties.getPassword())) {
            config.useSingleServer().setPassword(redisProperties.getPassword());
        }
        
        // 使用 Jackson 编解码器，传入已配置的 ObjectMapper
        // JsonJacksonCodec 会使用传入的 ObjectMapper，这样就能使用项目中配置的 LocalDateTime 序列化规则
        config.setCodec(new JsonJacksonCodec(objectMapper));
        
        return Redisson.create(config);
    }
}
