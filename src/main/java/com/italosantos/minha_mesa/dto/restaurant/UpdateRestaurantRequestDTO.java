package com.italosantos.minha_mesa.dto.restaurant;

import org.jspecify.annotations.Nullable;

public record UpdateRestaurantRequestDTO(
        @Nullable
        String name,
        @Nullable
        Boolean updateActive,
        @Nullable
        String phone,
        @Nullable
        String address

) {
}
