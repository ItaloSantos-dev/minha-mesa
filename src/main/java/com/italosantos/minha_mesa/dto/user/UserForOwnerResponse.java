package com.italosantos.minha_mesa.dto.user;

public record UserForOwnerResponse(
        String name,
        String phone,
        Integer reserveQuantity
) {
}
