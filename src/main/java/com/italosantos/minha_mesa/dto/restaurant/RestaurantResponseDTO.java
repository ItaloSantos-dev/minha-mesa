package com.italosantos.minha_mesa.dto.restaurant;

public record RestaurantResponseDTO(
        Integer id,
        String name,
        String phone,
        String address
        //dias da semana aberto
) {
}
