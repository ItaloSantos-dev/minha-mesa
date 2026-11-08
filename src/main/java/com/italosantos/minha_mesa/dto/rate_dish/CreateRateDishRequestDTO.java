package com.italosantos.minha_mesa.dto.rate_dish;

import org.jspecify.annotations.Nullable;

public record CreateRateDishRequestDTO(
        Integer reserveDishId,
        Integer rating,

        @Nullable
        String comment
) {
}
