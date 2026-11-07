package com.italosantos.minha_mesa.dto.reserve_dish;

import com.italosantos.minha_mesa.model.enums.ReserveDishStatus;
import org.jspecify.annotations.Nullable;

public record UpdateReserveDishRequestDTO(
        @Nullable
        ReserveDishStatus newStatus,
        @Nullable
        Integer newQuantity
) {
}
