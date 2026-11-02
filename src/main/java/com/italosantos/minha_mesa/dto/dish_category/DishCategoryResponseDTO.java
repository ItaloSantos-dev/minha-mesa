package com.italosantos.minha_mesa.dto.dish_category;

public record DishCategoryResponseDTO(
    Integer id,
    String restaurantId,
    String name,
    String imageLink,
    Boolean active,
    String slug
) {
}
