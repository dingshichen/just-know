package cn.dsc.jk.config.mvc;

import cn.hutool.core.date.DatePattern;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

/**
 * @author ding.shichen
 */
public class JacksonCustomizer implements Jackson2ObjectMapperBuilderCustomizer {

    @Override
    public void customize(Jackson2ObjectMapperBuilder builder) {
        JavaTimeModule javaTimeModule = new JavaTimeModule();

        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_PATTERN);
        DateTimeFormatter dateFormatter = new DateTimeFormatterBuilder()
                .appendPattern(DatePattern.NORM_DATE_PATTERN)
                .parseDefaulting(ChronoField.HOUR_OF_DAY, 0)
                .parseDefaulting(ChronoField.MINUTE_OF_HOUR, 0)
                .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
                .toFormatter();

        // 构建多格式解析器：使用可选方式并列两种格式
        DateTimeFormatter multiFormatter = new DateTimeFormatterBuilder()
                .appendOptional(dateTimeFormatter)  // 先尝试日期时间格式
                .appendOptional(dateFormatter)      // 再尝试纯日期格式
                .toFormatter();

        // 配置序列化器
        javaTimeModule.addSerializer(LocalDate.class, new LocalDateSerializer(dateFormatter));
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(dateTimeFormatter));


        // 配置反序列化器（支持多格式解析）
        javaTimeModule.addDeserializer(LocalDate.class, new LocalDateDeserializer(multiFormatter));
        javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(multiFormatter));

        // 注册模块并附加Long类型序列化器（解决Long精度问题，可选）
        builder.modules(javaTimeModule)
                .serializerByType(Long.class, ToStringSerializer.instance);
    }
}
