package cn.dsc.jk.util;

import cn.hutool.core.util.StrUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

/**
 * Web工具类
 * 用于从HttpServletRequest中提取客户端信息
 *
 * @author ding.shichen
 */
@Slf4j
public class WebUtils {

    /**
     * 从请求中获取客户端IP地址
     *
     * @param request HTTP请求
     * @return IP地址
     */
    public static String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (StrUtil.isNotBlank(ip) && !"unknown".equalsIgnoreCase(ip)) {
            // 多次反向代理后会有多个IP值，第一个IP才是真实IP
            int index = ip.indexOf(',');
            if (index != -1) {
                return ip.substring(0, index).trim();
            }
            return ip.trim();
        }
        ip = request.getHeader("X-Real-IP");
        if (StrUtil.isNotBlank(ip) && !"unknown".equalsIgnoreCase(ip)) {
            return ip.trim();
        }
        ip = request.getHeader("Proxy-Client-IP");
        if (StrUtil.isNotBlank(ip) && !"unknown".equalsIgnoreCase(ip)) {
            return ip.trim();
        }
        ip = request.getHeader("WL-Proxy-Client-IP");
        if (StrUtil.isNotBlank(ip) && !"unknown".equalsIgnoreCase(ip)) {
            return ip.trim();
        }
        ip = request.getHeader("HTTP_CLIENT_IP");
        if (StrUtil.isNotBlank(ip) && !"unknown".equalsIgnoreCase(ip)) {
            return ip.trim();
        }
        ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        if (StrUtil.isNotBlank(ip) && !"unknown".equalsIgnoreCase(ip)) {
            return ip.trim();
        }
        return request.getRemoteAddr();
    }

    /**
     * 从User-Agent中解析设备信息（操作系统）
     *
     * @param userAgent User-Agent字符串
     * @return 设备信息
     */
    public static String parseDevice(String userAgent) {
        if (StrUtil.isBlank(userAgent)) {
            return "未知设备";
        }
        String ua = userAgent.toLowerCase();
        if (ua.contains("harmonyos") || ua.contains("harmony")) {
            return "HarmonyOS";
        } else if (ua.contains("windows")) {
            return "Windows";
        } else if (ua.contains("mac os x") || ua.contains("macintosh")) {
            return "macOS";
        } else if (ua.contains("linux")) {
            return "Linux";
        } else if (ua.contains("android")) {
            return "Android";
        } else if (ua.contains("iphone") || ua.contains("ipod")) {
            return "iOS";
        } else if (ua.contains("ipad")) {
            return "iPadOS";
        }
        return "未知设备";
    }

    /**
     * 从User-Agent中解析浏览器信息
     *
     * @param userAgent User-Agent字符串
     * @return 浏览器信息
     */
    public static String parseBrowser(String userAgent) {
        if (StrUtil.isBlank(userAgent)) {
            return "未知浏览器";
        }
        String ua = userAgent.toLowerCase();
        if (ua.contains("edg")) {
            return "Edge";
        } else if (ua.contains("chrome") && !ua.contains("edg")) {
            return "Chrome";
        } else if (ua.contains("firefox")) {
            return "Firefox";
        } else if (ua.contains("safari") && !ua.contains("chrome")) {
            return "Safari";
        } else if (ua.contains("opera") || ua.contains("opr")) {
            return "Opera";
        } else if (ua.contains("msie") || ua.contains("trident")) {
            return "Internet Explorer";
        }
        return "未知浏览器";
    }
}
