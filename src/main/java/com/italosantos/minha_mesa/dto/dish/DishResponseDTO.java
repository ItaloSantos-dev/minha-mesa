package com.italosantos.minha_mesa.dto.dish;

import org.jspecify.annotations.Nullable;

import java.math.BigDecimal;

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
        Boolean active
) {
}
