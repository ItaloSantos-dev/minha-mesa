package com.italosantos.minha_mesa.dto.reserve_dish;

public record CreateReserveDishRequestDTO(
        Integer reserveId,
        Integer dishId,
        Integer quantity
) {
}
