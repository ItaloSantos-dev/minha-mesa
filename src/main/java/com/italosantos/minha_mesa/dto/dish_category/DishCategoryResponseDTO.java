package com.italosantos.minha_mesa.dto.dish_category;

import com.italosantos.minha_mesa.dto.dish.DishResponseDTO;

import java.util.List;

public record DishCategoryResponseDTO(
    Integer id,
    String restaurantId,
    String name,
    String imageLink,
    Boolean active,
    String slug,
    List<DishResponseDTO> dishes
) {
}
