package com.italosantos.minha_mesa.dto.dish;

import com.italosantos.minha_mesa.dto.rate_dish.RateDishResponseDTO;
import org.jspecify.annotations.Nullable;

import java.math.BigDecimal;
import java.util.List;

public record DishResponseDTO(
        Integer id,
        String name,
        String dishCategoryName,
        Integer dishCategoryId,
        String restaurantName,
        Integer restaurantId,
        @Nullable
        String description,
        Integer preparationTime,
        BigDecimal rating,
        BigDecimal price,
        String slug,
        String imageLink,
        Boolean active,
        List<RateDishResponseDTO> rates
) {
}
