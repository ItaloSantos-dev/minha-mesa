package com.italosantos.minha_mesa.service;

import com.italosantos.minha_mesa.exception.RequestRateLimitExceededException;
import com.italosantos.minha_mesa.infra.RedisCacheConfig;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RateLimitService {

    private final StringRedisTemplate stringRedisTemplate;

    public RateLimitService(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    public void rateLimit(HttpServletRequest request){
        String endpoint = request.getRequestURI();

        if (endpoint.equals("/auth/login"))
            this.rateLimitLogin(request);

        if (request.getMethod().equalsIgnoreCase("get"))
            this.rateLimitGet(request);
        else
            this.rateLimitOthersMethods(request);
    }

    private void rateLimitLogin(HttpServletRequest request)throws RequestRateLimitExceededException{
        String ipOfRequest = request.getRemoteAddr();
        String key = RedisCacheConfig.REQUESTSLOGINCACHENAME + "::" + ipOfRequest;
        Long quantityRequest = this.stringRedisTemplate.opsForValue().increment(key);

        if (quantityRequest==1)
            this.stringRedisTemplate.expire(key, Duration.ofMinutes(1));

        if (quantityRequest>=5)
            throw new RequestRateLimitExceededException();

    }

    private void rateLimitGet(HttpServletRequest request){
        String ipOfRequest = request.getRemoteAddr();
        String key = RedisCacheConfig.REQUESTSGETCACHENAME + "::" + ipOfRequest;
        Long quantityRequest = this.stringRedisTemplate.opsForValue().increment(key);
        if (quantityRequest==1)
            this.stringRedisTemplate.expire(key, Duration.ofMinutes(1));

        if (quantityRequest>=60)
            throw new RequestRateLimitExceededException();
    }

    private void rateLimitOthersMethods(HttpServletRequest request){
        String ipOfRequest = request.getRemoteAddr();
        String key = RedisCacheConfig.REQUESTSOTHERSMETHODSCACHENAME + request.getMethod().toLowerCase() + "::" + ipOfRequest;
        Long quantityRequest = this.stringRedisTemplate.opsForValue().increment(key);
        if (quantityRequest==1)
            this.stringRedisTemplate.expire(key, Duration.ofMinutes(1));

        if (quantityRequest>=30)
            throw new RequestRateLimitExceededException();
    }
}
