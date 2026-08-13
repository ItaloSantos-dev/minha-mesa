package com.italosantos.minha_mesa.infra;

import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.dto.restaurant.RestaurantResponseDTO;
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
    public final static String RESERVESRESTAURANTCACHENAME = "reservas-restaurante";
    public final static String RESTAURANTCACHENAME = "restaurant";
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
                        this.reserveListCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        RESERVESRESTAURANTCACHENAME,
                        this.reserveListCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        RESTAURANTCACHENAME,
                        this.restaurantCacheConfig(defaultConfig)
                )
                .build();
    }

    private RedisCacheConfiguration reserveListCacheConfig(RedisCacheConfiguration defaultConfig){


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

    private RedisCacheConfiguration restaurantCacheConfig(RedisCacheConfiguration defaultConfig){

        JavaType restaurantType =
                this.objectMapper.getTypeFactory()
                        .constructType(
                                RestaurantResponseDTO.class
                        );
        JacksonJsonRedisSerializer<List<ReserveResponseDTO>> restaurantSerializer =
                new JacksonJsonRedisSerializer<>(
                        this.objectMapper,
                        restaurantType
                );

        return
                defaultConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(restaurantSerializer)
                );
    }
}

