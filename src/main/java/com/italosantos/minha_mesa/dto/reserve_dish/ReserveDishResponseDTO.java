package com.italosantos.minha_mesa.dto.reserve_dish;

import com.italosantos.minha_mesa.dto.rate_dish.RateDishResponseDTO;
import com.italosantos.minha_mesa.model.enums.ReserveDishStatus;

import jakarta.annotation.Nullable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ReserveDishResponseDTO(
        Integer id,
        Integer reserveId,
        Integer dishId,
        BigDecimal dishPrice,
        Integer quantity,
        Integer quantityCompleted,
        Integer quantityCanceled,
        Integer quantityPending,
        BigDecimal priceFinal,
        LocalDateTime createdAt,
        ReserveDishStatus status,

        @Nullable 
        RateDishResponseDTO rateDish
) {
}
