package com.italosantos.minha_mesa.dto.reserve_dish;

import com.italosantos.minha_mesa.model.enums.ReserveDishStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ReserveDishResponseDTO(
        Integer id,
        Integer reserveId,
        Integer dishId,
        BigDecimal dishPrice,
        Integer quantity,
        LocalDateTime createdAt,
        ReserveDishStatus status
) {
}
