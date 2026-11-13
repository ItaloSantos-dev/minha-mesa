package com.italosantos.minha_mesa.dto.dish_category;

import org.jspecify.annotations.Nullable;

import java.util.List;

public record CreateDishCategoryRequestDTO(
    String name,
    @Nullable
    List<Integer> dishIds
) {
}
