package com.italosantos.minha_mesa.dto.rate_dish;

public record RateDishResponseDTO(
        Integer id,
        Integer dishId,
        String dishName,
        Integer reserveId,
        String restaurantName,
        Integer rating,
        String comment
) {
}
