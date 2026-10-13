package com.venuevista.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Value("${app.frontend-url:http://localhost:3000}")
  private String frontendUrl;

  @Override
  public void addCorsMappings(@NonNull CorsRegistry registry) {
    registry.addMapping("/api/**")
        .allowedOrigins(frontendUrl)
        .allowedOriginPatterns(
            "http://localhost:[*]",
            "http://127.0.0.1:[*]",
            "http://10.*.*.*:[*]",
            "http://172.*.*.*:[*]",
            "http://192.168.*.*:[*]")
        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        .allowedHeaders("*");
  }
}
