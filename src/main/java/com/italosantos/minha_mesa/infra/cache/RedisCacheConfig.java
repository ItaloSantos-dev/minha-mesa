package com.italosantos.minha_mesa.infra.cache;

import com.italosantos.minha_mesa.dto.dish.DishResponseDTO;
import com.italosantos.minha_mesa.dto.dish.DishesOfRestauranteResponseDTO;
import com.italosantos.minha_mesa.dto.reserve.ReserveResponseDTO;
import com.italosantos.minha_mesa.dto.restaurant.RestaurantResponseDTO;
import com.italosantos.minha_mesa.dto.restaurant.dashboard.DashboardRestaurantResponseDTO;
import com.italosantos.minha_mesa.dto.schedule_exception.ScheduleExceptionResponseDTO;
import com.italosantos.minha_mesa.dto.table.TableResponseDTO;
import com.italosantos.minha_mesa.dto.user.UserForOwnerResponse;
import com.italosantos.minha_mesa.dto.working_schedule.WorkingScheduleResponseDTO;
import org.jspecify.annotations.Nullable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.*;
import tools.jackson.databind.JavaType;
import tools.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.List;

@Configuration
public class RedisCacheConfig {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Duration defaultTtl = Duration.ofMinutes(5);

    @Bean
    public RedisCacheManager redisCacheManager(
            RedisConnectionFactory redisConnectionFactory
    )  {
        RedisCacheConfiguration defaultConfig =
                RedisCacheConfiguration.defaultCacheConfig()
                        .serializeKeysWith(
                                RedisSerializationContext.SerializationPair
                                        .fromSerializer(new StringRedisSerializer())
                        );

        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultConfig)
                .withCacheConfiguration(
                        CacheName.RESERVESBYUSERSCACHENAME,
                        generateCacheConfigOfListClass(ReserveResponseDTO.class, defaultConfig, null)
                )
                .withCacheConfiguration(
                        CacheName.RESERVESRESTAURANTBYOWNERCACHENAME,
                        generateCacheConfigOfListClass(ReserveResponseDTO.class, defaultConfig, null)
                )
                .withCacheConfiguration(
                        CacheName.RESTAURANTCACHENAME,
                        generateCacheConfigOfUniqueClass(RestaurantResponseDTO.class, defaultConfig, null)
                )
                .withCacheConfiguration(
                        CacheName.REQUESTSLOGINCACHENAME,
                        RedisCacheConfiguration.defaultCacheConfig()
                                .serializeKeysWith(
                                        RedisSerializationContext.SerializationPair
                                                .fromSerializer(new StringRedisSerializer())
                                )
                                .entryTtl(Duration.ofMinutes(1))
                )
                .withCacheConfiguration(
                        CacheName.TABLEAVALIABLESBYRESTAURANTCACHENAME,
                        generateCacheConfigOfListClass(TableResponseDTO.class, defaultConfig, null)
                )
                .withCacheConfiguration(
                        CacheName.DASHBOARDBYOWNERCACHENAME,
                        generateCacheConfigOfUniqueClass(
                                DashboardRestaurantResponseDTO.class,
                                defaultConfig,
                                Duration.ofMinutes(5)
                        )
                )
                .withCacheConfiguration(
                        CacheName.TABLESBYRESTAURANTCACHENAME,
                        generateCacheConfigOfListClass(TableResponseDTO.class, defaultConfig, null)
                )
                .withCacheConfiguration(
                        CacheName.RESTAURANTSBYSEARCHEDCACHENAME,
                        generateCacheConfigOfListClass(
                                RestaurantResponseDTO.class,
                                defaultConfig,
                                Duration.ofMinutes(5)
                        )
                )
                .withCacheConfiguration(
                        CacheName.WORKINGDAYSBYRESTAURANTCACHENAME,
                        generateCacheConfigOfListClass(
                                WorkingScheduleResponseDTO.class,
                                defaultConfig,
                                null
                        )
                )
                .withCacheConfiguration(
                        CacheName.WORKINGDAYSBYOWNERCACHENAME,
                        generateCacheConfigOfListClass(
                                WorkingScheduleResponseDTO.class,
                                defaultConfig,
                                null
                        )
                )
                .withCacheConfiguration(
                        CacheName.EXCEPTIONSBYOWNERCACHENAME,
                        generateCacheConfigOfListClass(
                                ScheduleExceptionResponseDTO.class,
                                defaultConfig,
                                null
                        )
                )
                .withCacheConfiguration(
                        CacheName.DISHESBYRESTAURANTSLUGCACHENAME,
                        generateCacheConfigOfUniqueClass(
                                DishesOfRestauranteResponseDTO.class,
                                defaultConfig,
                                null
                        )
                )
                .withCacheConfiguration(
                        CacheName.DISHESBYOWNERCACHENAME,
                        generateCacheConfigOfUniqueClass(
                                DishesOfRestauranteResponseDTO.class,
                                defaultConfig,
                                null
                        )
                )
                .withCacheConfiguration(
                        CacheName.CLIENTSRESTAURANTBYOWNER,
                        generateCacheConfigOfListClass(
                                UserForOwnerResponse.class,
                                defaultConfig,
                                null
                        )
                )
                .withCacheConfiguration(
                        CacheName.RESTAURANTBYOWNERCACHENAME,
                        generateCacheConfigOfUniqueClass(
                                RestaurantResponseDTO.class,
                                defaultConfig,
                                null
                        )
                )
                .build();
    }

    private RedisCacheConfiguration generateCacheConfigOfUniqueClass(Class<?> clazz, RedisCacheConfiguration defaultConfig, @Nullable Duration ttl){
        JavaType classType =
                this.objectMapper.getTypeFactory()
                        .constructType(
                                clazz
                        );
        JacksonJsonRedisSerializer<List<ReserveResponseDTO>> typeSerializer =
                new JacksonJsonRedisSerializer<>(
                        this.objectMapper,
                        classType
                );

        return
                defaultConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(typeSerializer)
                )
                .entryTtl(ttl!=null ? ttl : this.defaultTtl );
    }

    private RedisCacheConfiguration generateCacheConfigOfListClass (Class<?> clazz, RedisCacheConfiguration defaultConfig, @Nullable Duration ttl){
        JavaType classListType =
                this.objectMapper.getTypeFactory()
                        .constructCollectionType(
                                List.class,
                                clazz
                        );
        JacksonJsonRedisSerializer<List<ReserveResponseDTO>> classListSerializer =
                new JacksonJsonRedisSerializer<>(
                        this.objectMapper,
                        classListType
                );

        return
                defaultConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(classListSerializer)
                )
                .entryTtl(ttl!=null ? ttl : this.defaultTtl );
    }

}

