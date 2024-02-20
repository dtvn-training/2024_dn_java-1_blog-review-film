package com.dac.BackEnd.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.dac.BackEnd.security.jwt.JwtEntryPoint;
import com.dac.BackEnd.security.jwt.JwtTokenFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig{
    
    @Autowired
    private JwtEntryPoint jwtEntryPoint;

    @Bean
    public JwtTokenFilter jwtTokenFilter() {
        return new JwtTokenFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth ->
                    auth.requestMatchers("/api/admin/**")
                            .hasRole("ADMIN")
                            .requestMatchers("/api/reviewer/**")
                            .hasAnyRole("ADMIN", "REVIEWER")
                            .anyRequest()
                            .permitAll()
                )
                .exceptionHandling(exceptionHandling ->
                    exceptionHandling.authenticationEntryPoint(jwtEntryPoint)
                )
                .formLogin(formLogin -> formLogin.disable()) // Vô hiệu hóa form login
                .logout(logout -> logout 
                        .logoutUrl("api/auth/logout") // Cấu hình URL logout
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                )
                
        ;
        http.addFilterBefore(jwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}