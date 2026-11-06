package com.italosantos.minha_mesa.dto.dish;

import jakarta.annotation.Nullable;

import java.math.BigDecimal;

public record UpdateDishRequestDTO(
        @Nullable
        String name,

        @Nullable
        Integer dishCategory,

        @Nullable
        String description,

        @Nullable
        Integer preparationTime,

        @Nullable
        BigDecimal price,

        @Nullable
        Boolean active
) {
}
