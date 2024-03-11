package com.dac.BackEnd.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{

    @Value("${client.domain}")
    private String clientDomain;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") 
            .allowedOrigins(clientDomain, "http://14.225.36.84")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
            .allowedHeaders("*");
    }
}
