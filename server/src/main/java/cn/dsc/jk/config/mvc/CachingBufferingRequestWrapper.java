package cn.dsc.jk.config.mvc;

import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.StrUtil;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import lombok.SneakyThrows;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.Charset;

/**
 * @author ding.shichen
 */
public class CachingBufferingRequestWrapper extends HttpServletRequestWrapper {

    private byte[] body;

    private boolean isMultipart = false;

    public CachingBufferingRequestWrapper(HttpServletRequest request) {
        super(request);
        init(request);
    }

    @Override
    public BufferedReader getReader() throws IOException {
        if (isMultipart) {
            return super.getReader();
        }
        return IoUtil.getReader(getInputStream(), Charset.defaultCharset());
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        if (isMultipart) {
            return super.getInputStream();
        }
        ByteArrayInputStream ins = new ByteArrayInputStream(body);
        return new ServletInputStream() {
            @Override
            public boolean isFinished() {
                return ins.available() == 0;
            }

            @Override
            public boolean isReady() {
                return true;
            }

            @Override
            public void setReadListener(ReadListener readListener) {
            }

            @Override
            public int read() {
                return ins.read();
            }
        };
    }

    @SneakyThrows
    private void init(HttpServletRequest request) {
        String contentType = request.getContentType();
        isMultipart = contentType != null && contentType.toLowerCase().startsWith("multipart/");
        if (isMultipart) {
            return;
        }
        body = IoUtil.readBytes(request.getInputStream());
    }

    public String getContextString() {
        if (isMultipart) {
            return StrUtil.EMPTY;
        }
        return new String(body, Charset.defaultCharset());
    }
}
