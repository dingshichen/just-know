package cn.dsc.jk;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableAsync;

import cn.hutool.extra.spring.SpringUtil;

/**
 * @author ding.shichen
 */
@EnableAsync
@Import(SpringUtil.class)
@MapperScan("cn.dsc.jk.mapper")
@SpringBootApplication
public class JustKnowApplication {

    static void main(String[] args) {
        SpringApplication.run(JustKnowApplication.class, args);
    }

}
