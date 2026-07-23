package com.italosantos.minha_mesa.dto.restaurant;

import com.italosantos.minha_mesa.dto.owner.CreateOwnerDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateRestaurantRequestDTO(
        @NotBlank
        String name,

        @NotBlank
        String address,

        @NotBlank
        @Size(min = 11)
        String phone,

        @NotBlank
        CreateOwnerDTO ownerData
) {
}
