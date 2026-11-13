package com.italosantos.minha_mesa.dto.dish;

import org.jspecify.annotations.Nullable;

import java.math.BigDecimal;

public record CreateDishRequestDTO(
        String name,
        @Nullable
        Integer dishCategory,
        @Nullable
        String description,
        Integer preparationTime, //seconds
        BigDecimal price

) {
}
