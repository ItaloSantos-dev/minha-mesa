package com.italosantos.minha_mesa.dto.user;

import com.italosantos.minha_mesa.model.enums.UserRole;

public record UserResponseDTO(
        Integer id,
        String name,
        String phone,
        UserRole role
) {
}
