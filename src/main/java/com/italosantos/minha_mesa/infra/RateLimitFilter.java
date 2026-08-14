package com.italosantos.minha_mesa.infra;

import com.italosantos.minha_mesa.exception.RequestRateLimitExceededException;
import com.italosantos.minha_mesa.service.CacheService;
import com.italosantos.minha_mesa.service.RateLimitService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
    private final RateLimitService rateLimitService;

    public RateLimitFilter(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            rateLimitService.rateLimit(request);

            filterChain.doFilter(request, response);

        } catch (RequestRateLimitExceededException exception) {

            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");

            response.getWriter().write("""
            {
                "status": 429,
                "message": "Quantidade máxima de requisições atingida"
            }
            """);
        }
    }





}
