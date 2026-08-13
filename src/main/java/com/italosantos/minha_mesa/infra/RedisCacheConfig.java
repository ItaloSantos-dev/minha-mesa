package com.italosantos.minha_mesa.infra;

import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.*;
import tools.jackson.databind.JavaType;
import tools.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.List;

@Configuration
public class RedisCacheConfig {
    private final ObjectMapper objectMapper = new ObjectMapper();
    public final static String RESERVESUSERSCACHENAME = "reservas-usuario";
    @Bean
    public RedisCacheManager redisCacheManager(
            RedisConnectionFactory redisConnectionFactory
    ) {





        RedisCacheConfiguration defaultConfig =
                RedisCacheConfiguration.defaultCacheConfig()
                        .serializeKeysWith(
                                RedisSerializationContext.SerializationPair
                                        .fromSerializer(new StringRedisSerializer())
                        )
                        .entryTtl(Duration.ofMinutes(5));



        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultConfig)
                .withCacheConfiguration(
                        RESERVESUSERSCACHENAME,
                        this.reservasUsuarioCacheConfig(defaultConfig)
                )
                .build();
    }

    private RedisCacheConfiguration reservasUsuarioCacheConfig(RedisCacheConfiguration defaultConfig){


        JavaType reservasUsuarioType =
                this.objectMapper.getTypeFactory()
                        .constructCollectionType(
                                List.class,
                                ReserveResponseDTO.class
                        );
        JacksonJsonRedisSerializer<List<ReserveResponseDTO>> reservasUsuarioSerializer =
                new JacksonJsonRedisSerializer<>(
                        this.objectMapper,
                        reservasUsuarioType
                );

        return
                defaultConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(reservasUsuarioSerializer)
                );
    }
}

