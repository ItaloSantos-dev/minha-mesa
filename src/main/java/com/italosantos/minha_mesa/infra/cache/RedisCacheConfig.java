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
                        CacheName.RESERVESUSERSCACHENAME,
                        this.reserveListCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        CacheName.RESERVESRESTAURANTCACHENAME,
                        this.reserveListCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        CacheName.RESTAURANTCACHENAME,
                        this.restaurantCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        CacheName.REQUESTSLOGINCACHENAME,
                        this.requestLoginCacheConfig()
                )
                .withCacheConfiguration(
                        CacheName.TABLEAVALIABLECACHENAME,
                        this.tableListCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        CacheName.DASHBOARDRESTAURANTCACHENAME,
                        this.dashboardRestaurantCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        CacheName.TABLESOFRESTAURANTCACHENAME,
                        this.tableListCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        CacheName.RESTAURANTSEARCHEDCACHENAME,
                        this.restaurantListCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        CacheName.WORKINGDAYSRESTAURANTCACHENAME,
                        this.workingDayListCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        CacheName.WORKINGDAYSRESTAURANTBYOWNERCACHENAME,
                        this.workingDayListCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        CacheName.EXCEPTIONSRESTAURANTBYOWNERCACHENAME,
                        this.scheduleExceptionListCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        CacheName.DISHESBYRESTAURANTSLUGCACHENAME,
                        this.dishesOfOwnerCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        CacheName.DISHESBYOWNERCACHENAME,
                        this.dishesOfOwnerCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        CacheName.CLIENTSRESTAURANTBYOWNER,
                        this.userForOwnerListCacheConfig(defaultConfig)
                )
                .withCacheConfiguration(
                        CacheName.RESTAURANTBYOWNERCACHENAME,
                        this.restaurantCacheConfig(defaultConfig)
                )
                .build();
    }

    private RedisCacheConfiguration dishesOfOwnerCacheConfig(RedisCacheConfiguration defaultConfig){

        JavaType dishesOfRestaurantType =
                this.objectMapper.getTypeFactory()
                        .constructType(
                                DishesOfRestauranteResponseDTO.class
                        );
        JacksonJsonRedisSerializer<List<ReserveResponseDTO>> dishesOfRestaurantSerializer =
                new JacksonJsonRedisSerializer<>(
                        this.objectMapper,
                        dishesOfRestaurantType
                );

        return
                defaultConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(dishesOfRestaurantSerializer)
                );
    }

    private RedisCacheConfiguration userForOwnerListCacheConfig(RedisCacheConfiguration defaultConfig){
        JavaType userForOwnerType =
                this.objectMapper.getTypeFactory()
                        .constructCollectionType(
                                List.class,
                                UserForOwnerResponse.class
                        );
        JacksonJsonRedisSerializer<List<ReserveResponseDTO>> userForOwnerSerializer =
                new JacksonJsonRedisSerializer<>(
                        this.objectMapper,
                        userForOwnerType
                );

        return
                defaultConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(userForOwnerSerializer)
                );
    }

    private RedisCacheConfiguration dishesListCacheConfig(RedisCacheConfiguration defaultConfig){
        JavaType dishesType =
                this.objectMapper.getTypeFactory()
                        .constructCollectionType(
                                List.class,
                                DishResponseDTO.class
                        );
        JacksonJsonRedisSerializer<List<ReserveResponseDTO>> dishesSerializer =
                new JacksonJsonRedisSerializer<>(
                        this.objectMapper,
                        dishesType
                );

        return
                defaultConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(dishesSerializer)
                );
    }

    private RedisCacheConfiguration scheduleExceptionListCacheConfig(RedisCacheConfiguration defaultConfig){
        JavaType scheduleExceptionsType =
                this.objectMapper.getTypeFactory()
                        .constructCollectionType(
                                List.class,
                                ScheduleExceptionResponseDTO.class
                        );
        JacksonJsonRedisSerializer<List<ReserveResponseDTO>> scheduleExceptionsSerializer =
                new JacksonJsonRedisSerializer<>(
                        this.objectMapper,
                        scheduleExceptionsType
                );

        return
                defaultConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(scheduleExceptionsSerializer)
                );
    }

    private RedisCacheConfiguration workingDayListCacheConfig(RedisCacheConfiguration defaultConfig){
        JavaType workingDaysType =
                this.objectMapper.getTypeFactory()
                        .constructCollectionType(
                                List.class,
                                WorkingScheduleResponseDTO.class
                        );
        JacksonJsonRedisSerializer<List<ReserveResponseDTO>> workingDaysSerializer =
                new JacksonJsonRedisSerializer<>(
                        this.objectMapper,
                        workingDaysType
                );

        return
                defaultConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(workingDaysSerializer)
                );
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

    private RedisCacheConfiguration restaurantListCacheConfig(RedisCacheConfiguration defaultConfig){
        JavaType restauranType =
                this.objectMapper.getTypeFactory()
                        .constructCollectionType(
                                List.class,
                                RestaurantResponseDTO.class
                        );
        JacksonJsonRedisSerializer<List<ReserveResponseDTO>> restaurantsSerializer =
                new JacksonJsonRedisSerializer<>(
                        this.objectMapper,
                        restauranType
                );

        return
                defaultConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(restaurantsSerializer)
                ).entryTtl(
                        Duration.ofMinutes(5)
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



    private RedisCacheConfiguration tableListCacheConfig(RedisCacheConfiguration defaultConfig){

        JavaType tableType =
                this.objectMapper.getTypeFactory()
                        .constructCollectionType(
                                List.class,
                                TableResponseDTO.class
                        );
        JacksonJsonRedisSerializer<List<ReserveResponseDTO>> restaurantSerializer =
                new JacksonJsonRedisSerializer<>(
                        this.objectMapper,
                        tableType
                );

        return
                defaultConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(restaurantSerializer)
                );
    }



    private RedisCacheConfiguration requestLoginCacheConfig(){
        return RedisCacheConfiguration.defaultCacheConfig()
                        .serializeKeysWith(
                                RedisSerializationContext.SerializationPair
                                        .fromSerializer(new StringRedisSerializer())
                        )
                        .entryTtl(Duration.ofMinutes(1));
    }

    private RedisCacheConfiguration dashboardRestaurantCacheConfig(RedisCacheConfiguration defaultConfig){

        JavaType dashboardRestaurantType =
                this.objectMapper.getTypeFactory()
                        .constructType(
                                DashboardRestaurantResponseDTO.class
                        );
        JacksonJsonRedisSerializer<List<ReserveResponseDTO>> restaurantSerializer =
                new JacksonJsonRedisSerializer<>(
                        this.objectMapper,
                        dashboardRestaurantType
                );

        return
                defaultConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(restaurantSerializer)
                ).entryTtl(Duration.ofMinutes(5));
    }
}

