package com.italosantos.minha_mesa.dto.dish;

import com.italosantos.minha_mesa.dto.dish_category.DishCategoryResponseDTO;

import java.util.List;

public record DishesOfRestauranteResponseDTO(
        List<DishCategoryResponseDTO> categories,
        List<DishResponseDTO> dishesWithoutCategories
) {
}
