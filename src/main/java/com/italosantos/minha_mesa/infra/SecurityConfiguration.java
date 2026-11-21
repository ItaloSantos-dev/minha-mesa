package com.italosantos.minha_mesa.infra;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    private final SecurityTokenAccessFilter securityTokenAccessFilter;
    private final SecurityTokenXsrfFilter securityTokenXsrfFilter;
    private final RateLimitFilter rateLimitFilter;
    public static String accessTokenCookieKeyName = "access_token";
    public static String xsrfTokenCookieKeyName = "XSRF-TOKEN";

    public SecurityConfiguration(SecurityTokenAccessFilter securityTokenAccessFilter, SecurityTokenXsrfFilter securityTokenXsrfFilter, RateLimitFilter rateLimitFilter) {
        this.securityTokenAccessFilter = securityTokenAccessFilter;
        this.securityTokenXsrfFilter = securityTokenXsrfFilter;
        this.rateLimitFilter = rateLimitFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity){
        return httpSecurity
                .cors(cors ->cors.configurationSource(this.corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(this.securityTokenAccessFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(this.securityTokenXsrfFilter, SecurityTokenAccessFilter.class)
                .addFilterBefore(this.rateLimitFilter, SecurityTokenXsrfFilter.class)
                .authorizeHttpRequests(authorization -> authorization
                        .requestMatchers(HttpMethod.POST, "/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/tables/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/restaurants/*").permitAll()
                        .requestMatchers(HttpMethod.POST, "/restaurants").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exceptionHandling -> exceptionHandling.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .build();
    }

    @Bean
    public AuthenticationManager authenticationConfiguration(AuthenticationConfiguration authenticationConfiguration){
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
